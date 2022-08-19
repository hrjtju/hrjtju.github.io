---
layout: post
categories: posts
title: 【DatawhaleML】 2 线性模型
subtitle: Datawhale开源学习社区机器学习项目笔记
featured-image: /images/2016-11-19/abstract-1.jpg
tags: [Machine Learning]
date-string: AUGUST 19, 2022

---



## 1 线性回归

所谓线性模型即寻找一个与输入维数相同的向量，通过点积加偏置的方法获取预测函数，即：


$$
\hat f(\boldsymbol{x}) = w^\mathrm T \boldsymbol{x} + b
$$


其中$w,x \in \mathbb R^n，b \in \mathbb R$. 

线性模型具有良好的**可解释性**，因为权重向量中的每个分量表示输入数据中每一个分量的 “重要性”。



很自然的我们需要最小化预测值与标签值的差距，也即均方误差最小化。于是我们得到下式：


$$
(w^*, b^*) = \mathop{\mathrm{arg\min}}\limits_{(w, b)} \sum_{i}(\hat f(x_i) - y_i)^2
$$


其几何意义较好解释，也即两个向量之间的欧氏距离。或者解释为两个向量之差的**L2范数（norm）**。我们通过**最小二乘法** 可以得到其最优闭式解：


$$
\begin{align}
w &= \frac{\sum y_i(x_i - \bar x)}{\sum x_i^2 - \frac 1m (\sum x_i)^2}\\
b &= \frac 1m \sum(y_i - mx_i)
\end{align}
$$


对于多个属性我们也可以采用相似的方法：


$$
\hat{\boldsymbol{w}}^* = \mathop{\mathrm{arg\min}}\limits_{\hat{\boldsymbol{w}}} ~(\boldsymbol{y} - \boldsymbol {X}\boldsymbol {\hat w})^\mathrm T(\boldsymbol{y} - \boldsymbol {X}\boldsymbol {\hat w})
$$


其中$\boldsymbol {\hat w} = (\boldsymbol {w}; b) $，$\boldsymbol {X} = \begin{align} \left[\boldsymbol {x_1^\mathrm T}, 1; \boldsymbol {x_2^\mathrm T}, 1;...  \boldsymbol {x_n^\mathrm T}, 1; \right] \end{align}$





## 2 Logistic回归





## 3 线性判别分析（<font color="red">L</font>inear <font color="red">D</font>iscriminant <font color="red">A</font>nalysis）





## 4 多分类和数据不均衡的分类问题



