---
layout: post
categories: posts
title: 【DatawhaleML】 1 机器学习引入
subtitle: Datawhale开源学习社区机器学习项目笔记
featured-image: /images/2016-11-19/abstract-1.jpg
tags: [Machine Learning]
date-string: AUGUST 13, 2022

---



## 1 绪论



### 1.0 何谓机器学习

假设用$$P$$（criterion）来**评估**计算机程序在某**任务**$$T$$上的性能，如果一个程序（learning algorithm）通过**经验**$$E$$（data set）在$$T$$中任务上取得了性能的改善，则我们说关于$$T$$和$$P$$，该程序进行了学习



* **监督学习**——训练数据有标记信息，如同一个supervisor来**指导**你的行动
* **无监督学习**——训练数据没有标记信息，但需要训练得到数据之中的 “隐式” 标记比如书中的**聚类**
* **强化学习**——没有标记信息，智能体（agent）通过**试错（trial and error）**与环境（environment）交互获得奖励（reward），从而完成特定的控制任务（control）



我们希望我们的模型可以用于之前没见过的数据，因此我们要求模型具有不错的**泛化（generalization）能力**。但新的数据需要与喂给模型的样本数据取自同一分布且互不影响（试想如果有所影响问题将会变得复杂），即满足**样本空间**$$\mathcal D$$中的每个样本**独立同分布**（$$\mathrm{i.i.d.}$$）





### 1.1 NFL定理



假设样本空间$$\mathcal X$$和假设空间$$\mathcal H$$均离散，$$\mathfrak{L_a}$$和$$\mathfrak{L_b}$$为任意两个算法，$$f$$为学习的目标函数（即我们的函数要尽量往目标函数 “靠近” ）


$$
\sum_f\mathbb E_{ote}[\mathfrak{L_a}|X, f] = \sum_f \mathbb E_{ote}[\mathfrak{L_b}|X, f]
$$


其中


$$
\mathbb E_{ote}[\mathfrak{L_a}|X, f] := \sum_h \sum_{x \in \mathcal X - X} P(x) \cdot \mathbb I(h(x) \ne f(x)) \cdot P(h|X, \mathfrak L_a)
$$


和书上一样，我们如果考虑二分类问题，因为算法是任取的，所以会等可能地出现正确和错误两种情形。


所以示性函数这一项可以直接将其变成期望提出来：


$$
\begin{align}

\sum_f\mathbb E_{ote}[\mathfrak{L_a}|X, f] =& \sum_f \sum_h \sum_{x \in \mathcal X - X} P(x) \cdot \mathbb I(h(x) \ne f(x)) \cdot P(h|X, \mathfrak L_a)\\
=&  \frac 12 \sum_f \sum_h \sum_{x \in \mathcal X - X} P(x)  \cdot P(h|X, \mathfrak L_a)\\
=& \frac 12 \sum_f \sum_{x \in \mathcal X - X} P(x) \sum_h   \cdot P(h|X, \mathfrak L_a)\\
=& \frac 12 \sum_{x \in \mathcal X - X} P(x) \sum_f \cdot 1\\
\end{align}
$$


那么问题来了，这样的$$f$$到底有多少？我们引入一些定义和不加证明的断言：



> **集合的势**
>
> 如果集合$$A$$为有限集，则集合$$A$$的势为其所含元素的个数，记作$$|A|$$
>
> 如果集合$$A$$ 可以与自然数集 $$\mathbb N$$ 建立双射，它的势记作 $$\aleph_0$$ 。
>
> 两个集合间如果可以建立双射，那么他们的势相同。
>
> 有限集以及可以与自然数集建立双射的集合是可数集
>
> 除此之外的集合被称为不可数集。（感兴趣可以证明：$$\mathbb R$$上的闭区间$$[0,1]$$不是可数集）
>
> 
>
> **映射的个数**
>
> 假设存在一个映射$$f: A\rightarrow B$$，那么这样的映射的个数为$$|B|^{|A|}$$



这样上面的式子出了中间一项之外其他都是常数，而这显然与算法的选取无关。



**脱离具体问题谈论算法好坏没有意义，就像脱离具体问题谈数据结构的好坏一样。（例如堆和二叉搜索树）**





### 1.2 奥卡姆剃刀原理与泛化性能



**奥卡姆剃刀原理**

如非必要，误增实体。



那问题来了，如何界定何为**必要**，这又是一个麻烦的问题。事实上，书上所给的曲线拟合的例子，在拟合参数变多时，可以通过**正则化（regulization）**或者**增加数据个数**来很好的减轻过拟合的程度



### 1.3 *维度灾难







## 2 模型选择评估



### 2.1 模型评估方法



### 2.2 模型性能度量



