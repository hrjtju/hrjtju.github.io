---
layout: post
categories: posts
title: 【DatawhaleDA】 3 模型建立与评估
subtitle: Datawhale开源学习社区数据分析项目笔记
featured-image: /images/2016-11-19/V-1_bg.png
tags: [Data Analysis]
date-string: SEPTEMBER 23, 2022

---



## 3 模型建立与评估 (摆了，更多详见机器学习笔记)



### 3.0 数据预处理

* 缺失值填充

  ```python
  pd.fillna()
  ```

  

* 编码非数字量

  ```python
  pd.get_dummies(data)
  ```

  



### 3.1 模型选择



**模型选择决策树**

<img src="/images/2022-09/image-20220923003156006.png" alt="image-20220923003156006" style="zoom:50%;" />



**是否选择深度学习？**

TODO：



### 3.2 模型训练



**开始之前**

```python
# 分割训练集和测试集

from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=0)
```



**回归**

```python
# Logistic回归

from sklearn.linear_model import LogisticRegression

lr = LogisticRegression(C=100)  # C表征Loss中正则化项的比例，可以调整模型的过拟合和欠拟合程度
lr.fit(X_train, y_train)
```



**分类**

```python
# 随机森林算法，有效的减轻了单棵决策树的过拟合问题

from sklearn.ensemble import RandomForestClassifier

rfc2 = RandomForestClassifier(n_estimators=100, max_depth=5)
# 设置森林中的决策树颗数和最大深度

rfc2.fit(X_train, y_train)
```

<img src="/images/2022-09/image-20220923004432084.png" alt="image-20220923004432084" style="zoom:50%;" />

可以看到在设置大值以后明显出现了过拟合现象



**预测**

```python
pred = model.pridict(X_train)
print(pred[:10])                          # 输出二值化结果
print(model.pridict_proba(X_train)[:10])  # 输出概率值
```

输出概率值能告诉我们模型对分类有多少 “把握”。



### 3.3 模型评价方法



**k-折交叉验证**

<img src="/images/2022-09/image-20220923004845617.png" alt="image-20220923004845617" style="zoom:50%;" />

```python
from sklearn.model_selection import cross_val_score

lr = LogisticRegression(C=100)
scores = cross_val_score(lr, X_train, y_train, cv=10)  
# cv表示折数，若设置的太多，每一折的样本个数将会下降，则该检验方法失去意义
```



**混淆矩阵和F1-score**

我们在面对正负例样本极不均衡时需要用到。因为此时的Accuracy很有可能骗了你。

```python
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report

lr = LogisticRegression(C=100)
lr.fit(X_train, y_train)

pred = lr.predict(X_train)
confusion_mat = confusion_matrix(y_train, pred)

print(classification_report(y_train, pred), confusion_mat)
```



**ROC曲线**

```python
from sklearn.metrics import roc_curve

fpr, tpr, thresholds = roc_curve(y_test, lr.decision_function(X_test))
plt.plot(fpr, tpr, label="ROC Curve")
plt.xlabel("FPR")
plt.ylabel("TPR (recall)")
# 找到最接近于0的阈值
close_zero = np.argmin(np.abs(thresholds))
plt.plot(fpr[close_zero], tpr[close_zero], 'o', markersize=10, label="threshold zero", fillstyle="none", c='k', mew=2)
plt.legend(loc=4)
```

