---
layout: post
categories: posts
title: 【DatawhaleDA】 2 数据处理和可视化初步
subtitle: Datawhale开源学习社区数据分析项目笔记
featured-image: /images/2016-11-19/V-1_bg.png
tags: [Data Analysis]
date-string: SEPTEMBER 14, 2022

---



## Chapter 2

部分文档来源于 [Pandas文档](https://pandas.pydata.org/docs/)

### 2.1 数据清洗和特征处理



#### 2.1.1 缺失值观察

**统计每列的缺失值**

缺失值在我们分析中经常会为我们添麻烦。所以我们要知道它们在哪里，有多少

```python
# 方法1, 返回值类型为 numpy.ndarray

dfna = df.notna().to_numpy()
np.sum(1 - dfna, axis=0)
```

<img src="/images/2022-09/image-20220914082711202.png" alt="image-20220914082711202" style="zoom:50%;" />

```python
# 方法2, 返回值类型为 pandas.core.series.Series

df.isna().sum(axis=0)
```

<img src="/images/2022-09/image-20220914082721734.png" alt="image-20220914082721734" style="zoom:50%;" />

```python
# 方法3，直接调用之前的函数

df.info()
```



> Remark. 大家可能还会注意到另一个函数`df.notnull()`，其实他们两个是一样的（`df.isna`和`df.isnull`也一样）在文档里说它是`df.notna()`的别称（alias）：
>
> <img src="/images/2022-09/image-20220914083009114.png" alt="image-20220914083009114" style="zoom:50%;" />



**缺失值处理**

我们发现缺失值以后肯定不会放任不管……

* 一种直接的思路就是把含有缺失值的行给扔了

```python
df_dropna = df.dropna()
df_dropna.reset_index(drop=True)
```

* 另一种思路是将空值的地方填入某一个值，例如

```python
df.fillna(0)
```

但是这引出了另一个问题，不同的列可能数据类型不同，例如有些是整数，而有些是字符串。我们不能直接将所有的`NaN`都变成某一个数或者某一个字符串。这依然会对我们后续的处理带来麻烦。我们可以将`inplace`参数设置为`inplace=True`以在原表上直接进行更改。这样一来我们就可以仅在某一列上进行操作

```python
df_ = df
df_["Age"].fillna(0, inplace=True)
df_["Cabin"].fillna("Unknown", inplace=True)
```



> #### 对`dropna()`和`fillna()`的进一步研究
>
> 截图来自 [Pandas文档](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.dropna.html)
>
> <img src="/images/2022-09/image-20220914085814805.png" alt="image-20220914085814805" style="zoom:60%;" />
>
> 
>
> <img src="/images/2022-09/image-20220914090721160.png" alt="image-20220914090721160" style="zoom:60%;" />



**重复值观察与处理**

确定重复值

```python
df[df.duplicated()]
```

处理重复值

```python
# 直接采用索引
df = df[~df.duplicated()]

# 或者调用函数
df.drop_duplicates()
```



**连续数据离散化**



* `pandas.cut()`

* `pandas.qcut()`

Remark. `qcut()`中的q就是分位数的意思。所以我们可以不必通过排序后索引的方法来进行基于分位数的分箱。

```python
# 这样的方法略显笨重

a, b, c, d, e = int(891 * 0.1 - 1), int(891 * 0.3 - 1), int(891 * 0.5 - 1),\
                int(891 * 0.7 - 1), int(891 * 0.9 - 1)
df_sorted = df_.sort_values(by="Age", ascending=True)
df_sorted = df_sorted.reset_index(drop=True)

df_sorted.loc[:a], df_sorted.loc[a:b], df_sorted.loc[b:c]\
df_sorted.loc[c:d], df_sorted.loc[d:e], df_sorted.loc[e:]


# 直接使用函数更为方便

df_2["Age2"] = pd.qcut(df["Age"], q=[0, 0.1, 0.3, 0.5, 0.7, 0.9],\
                      labels = [1, 2, 3, 4, 5])
```



**非数值数据转换为数值数据**

一种方法是使用函数

* `Series.replace()`

将一个列表的值对应换成另一个列表的值：

```python
df['Sex'].replace(['male','female'],[1,2])
```



也可以调用`sklearn`中的函数：

```python
from sklearn.preprocessing import LabelEncoder

for feat in ['Cabin', 'Ticket']:       # 选择要处理的列
    lbl = LabelEncoder()
    label_dict = dict(zip(df[feat].unique(), range(df[feat].nunique())))
    df[feat + "_labelEncode"] = df[feat].map(label_dict)
    df[feat + "_labelEncode"] = lbl.fit_transform(df[feat].astype(str))
    
    # 下次一定补学 sklearn......
```



* `Series.map(<map>)`

`<map>`中的东西表示一个**映射关系**，所以字典自然的可以，我们当然也可以往里面写`lambda`函数，或者传一个自己写好的函数

```python
# 1 使用字典
df_2["Sex"].map({"female" : 0, "male" : 1})

# 2 使用函数
def hash(s: str):
    code = 0
    for i in s:
        code += ord(i)
    return code

df_2["Cabin"].map(hash)

# 3 使用lambda函数，这个函数和上面的hash()函数作用相同，实现思路也相同
df_2["Cabin"].map(lambda x:sum([ord(i) for i in x]))
```



由于有了这样的功能支持，我们也可以对任何一列做某种变换，使得我们可以借此得到我们想要的数据。例如问题中给出的筛选`Miss`等这样的字串，我们很自然的想到了正则表达式。所提取的规则是：两个字符以上（实际上测试过一个字符及以上的，结果发现和两个字符及以上结果一样），以大写字母开头，以点结束。因此我们可以写出正则表达式字符串：

```regex
r"\W[\w]+\."
```

我们拿它去干和上面相同的事情：

```python
df_2["Name"].map(lambda x:(re.findall(r"\W[\w]+\.", x)[0][:-1]))

# [0]是取第一个，因为在这种情形中这种提取结果有且仅有一个
# [:-1]是要把最后的 ‘.’ 去掉
```

这样就可以提取出需要的字串了。



Remark. 因为自己对`re`这个库不是很熟悉，试了两次发现`re.findall`返回的是匹配到的字符串组成的数组，于是就采用了这种看起来比较笨拙的方式



教程参考答案中使用的方法是`df["Name"].str.extract()`的方法。其本质也是通过正则表达式来进行字符串搜索。



### 2.2 数据重构



### 2.3 数据可视化
