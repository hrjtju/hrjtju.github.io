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


其中$$w,x \in \mathbb R^n，b \in \mathbb R$$. 

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


对于多个属性我们也可以采用相似的方法，称作**多元线性回归**：


$$
\hat{\boldsymbol{w}}^* = \mathop{\mathrm{arg\min}}\limits_{\hat{\boldsymbol{w}}} ~(\boldsymbol{y} - \boldsymbol {X}\boldsymbol {\hat w})^\mathrm T(\boldsymbol{y} - \boldsymbol {X}\boldsymbol {\hat w})
$$


其中$$\boldsymbol {\hat w} = (\boldsymbol {w}; b) $$，$$\boldsymbol {X} = \begin{align} \left[\boldsymbol {x_1^\mathrm T}, 1; \boldsymbol {x_2^\mathrm T}, 1;...  \boldsymbol {x_n^\mathrm T}, 1; \right] \end{align}$$。我们对需要优化的式子进行求导：


$$
\frac{\partial E_\hat w}{\partial \hat w}  = 2 \boldsymbol{X}^\mathrm T (\boldsymbol{X}\boldsymbol{\hat w} - \boldsymbol{y})
$$


上式可以解出最优，就要求 $$\boldsymbol{X}^\mathrm T\boldsymbol{X}$$ **可逆**或者说**正定**。但现实问题往往没有这么简单，需要引入其他的方法辅助解决问题，一种典型的方法就是**梯度下降法**



> ### 梯度下降法 (Gradient Decent Algorithm)
>
> 此部分参考 [李沐动手学深度学习中的线性回归部分](https://zh-v2.d2l.ai/chapter_linear-networks/linear-regression.html)
>
> 
>
> 我们将被优化的对象，也就是损失函数按照如下规则循环更新，直至收敛：
>
> 
>
> $$
> (\boldsymbol{w}, b) \leftarrow(\boldsymbol{w}, b)-\frac{\eta}{|\mathcal{B}|} \sum_{i \in \mathcal{B}} \partial_{(\boldsymbol{w}, b)} l^{(i)}(\boldsymbol{w}, b)
> $$
>
> 
>
> 其中$$~\mid~\mathcal{B}~\mid~$$ 表示一个小批量的大小。这也叫做**小批量梯度下降**。因为梯度总是指向函数值变化 “最快” 的方向，于是我们可以利用这一点来逐步逼近损失函数的局部最小值。注意在这个例子中损失函数是凸函数，所以我们使用这个方法总会收敛到全局最小值。（当然是在选取合适的**学习率**$$\eta$$的前提下）
>
> 
>
> 我们可能会想，除了欧氏距离，还有很多这样度量两点间距离的函数，为什么就用平方来刻画呢？我们从另一个角度来看这个问题：
>
> 假设数据的噪声服从正态分布：
>
> 
>
> $$
> y=\mathbf{w}^{\top} \mathbf{x}+b+\epsilon
> $$
>
> 
>
> 其中$$
> \epsilon \sim \mathcal{N}\left(0, \sigma^{2}\right)
> $$。我们考虑给定$$\boldsymbol X$$观测到某一个$$\boldsymbol y$$的概率：
>
> 
> $$
> \mathrm{Pr}[\boldsymbol y| \boldsymbol X] = \prod_{i} \frac 1{\sqrt{2\pi\sigma^2}} \exp \left\{ -\frac{1}{2\sigma^2} (y_i - \boldsymbol{w}^\mathrm T x_i - b)^2 \right\}
> $$
> 
>
> 将上式取负对数，就得到了带正号的二次项（剩下一项是与数据集本身相关的常数），也就是我们使用的均方误差函数。使得均方误差函数最小的那一个$$\boldsymbol {w}$$就使得观测到正确的$$\boldsymbol y$$的概率最大，和我们初始的目标相吻合。
>



当然，只拥有线性模型这一个工具是不足以对付很多实际问题的，于是我们可以对以上的线性模型进行变形，使得它可以逼近一系列不同的函数：


$$
y = g^{-1}(\boldsymbol{w}^\mathrm T \boldsymbol{x} + b)
$$


这里的$$g$$可以是任意的单调可微函数，比如 $$\ln(\cdot)$$，这也和我们中学时所学的一致。





## 2 Logistic回归



对于上面提到的$$g$$，一种很典型的变化如下：


$$
y = \frac 1{1 + e^{-(\boldsymbol{w}^\mathrm T \boldsymbol{x} + b)}}
$$


在这里的 $$g^{-1}$$ 称为**Sigmoid**单增函数，值域$$(0, 1)$$（读者自行验证）。上式通过适当的变换可以得到下面的形式：


$$
\ln \frac y{1-y} = \boldsymbol{w}^\mathrm T \boldsymbol{x} + b
$$


此时线性函数的组合表征预测为正例与反例的可能性之比的对数。等号左边的式子又称为**对数几率（logit）**。因此我们也可以写成给定$$\boldsymbol x$$的后验概率形式：


$$
\ln \frac {\mathrm{Pr}[~y =1~|~\boldsymbol{x}~]}{\mathrm{Pr}[~y = 0~|~\boldsymbol{x}~]} = \boldsymbol{w}^\mathrm T \boldsymbol{x} + b
$$


和上面一样，我们也采用**极大似然法**来使得模型输出正确标签的概率最大：


$$
\mathcal L(\boldsymbol w, b) = \sum_i \ln \mathrm{Pr}[~y_i~|~ \boldsymbol x_i; \boldsymbol w,b~]
$$


接下来使用梯度下降或者其他方法均可。（在书本的推导过程中，实际上出现了**交叉熵误差**的表达式，因为在决策树那一章中会着重讲有关信息熵等等的知识，这一块内容将会放在决策树那一章一并补充（我们要保证决策树的每一次分类都是 “最高效的” ））



> ### Newton法
>
> 
>
> 我们采用展开到二阶的Taylor公式：
>
> 
>
> $$
> \mathcal L(\boldsymbol \beta) = \mathcal L(\boldsymbol \beta_k) + \frac{\partial \mathcal L}{\partial \boldsymbol\beta} (\boldsymbol\beta-\boldsymbol\beta_k) + \frac 12 \frac{\partial^2 \mathcal L}{\partial\boldsymbol \beta\partial\boldsymbol\beta^\mathrm T}(\boldsymbol\beta-\boldsymbol\beta_k)^\mathrm T(\boldsymbol\beta-\boldsymbol\beta_k)
> $$
>
> 
>
> 令上式二阶导为零，得到如下的更新公式：
>
> 
>
> $$
> \boldsymbol \beta_{k+1}= \boldsymbol \beta_{k} - \left( \frac{\partial^2 \mathcal L}{\partial\boldsymbol \beta\partial\boldsymbol\beta^\mathrm T} \right)^{-1}\frac{\partial \mathcal L}{\partial \boldsymbol\beta}
> $$
>
> 
>
> 它的原理是利用一阶和二阶导数对函数做二次函数的近似，从而快速迭代至局部最小值





## 3 线性判别分析（<font color="red">L</font>inear <font color="red">D</font>iscriminant <font color="red">A</font>nalysis）



在二分类问题中，线性判别分析寻求一条投影直线，使得同类型的数据在直线上的投影尽可能的近，不同类型的数据之间隔得尽可能的远。任意选取一个向量$$\boldsymbol w$$，则同类数据的均值向量$$\boldsymbol\mu_k$$在其方向上的投影长度为$$\boldsymbol w^\mathrm T \boldsymbol\mu_k$$（回忆$$\mathbb R^2$$上的向量内积为$$\boldsymbol x^\mathrm T \boldsymbol y = \mid \boldsymbol x\mid \mid \boldsymbol y\mid \cos(<\boldsymbol x, \boldsymbol y>)$$），相当于每个分量做了适当的变换。其协方差矩阵$$\boldsymbol\Sigma_k$$在投影后变成了$$\boldsymbol w^\mathrm T \boldsymbol\Sigma_k \boldsymbol w$$。（回忆协方差矩阵的每个分量对应着数据中两个分量之间的协方差，由协方差定义知这样做也是之前将每个分量做适当的变换后得到的结果，考虑将$$\boldsymbol w$$分解为线性空间内标准正交基的和. ）

回到我们的目标，我们要使得组间尽量分散，组内尽量聚拢，于是我们定义下式：


$$
J := \frac{\| \boldsymbol w^\mathrm T \boldsymbol\mu_0 - \boldsymbol w^\mathrm T \boldsymbol\mu_1 \|_2^2}{\boldsymbol w^\mathrm T(\boldsymbol\Sigma_0 + \boldsymbol\Sigma_1)\boldsymbol w} 
= \frac{\boldsymbol w^\mathrm T (\boldsymbol\mu_0 - \boldsymbol\mu_1)(\boldsymbol\mu_0 - \boldsymbol\mu_1)\boldsymbol w }{\boldsymbol w^\mathrm T(\boldsymbol\Sigma_0 + \boldsymbol\Sigma_1)\boldsymbol w} 

= \frac{\boldsymbol w^\mathrm T \boldsymbol S_b \boldsymbol w }{\boldsymbol w^\mathrm T\boldsymbol S_w \boldsymbol w}
$$


式中分子刻画组间距离，分母刻画组内的 “分散程度”，这就是我们的最大化目标。我们发现$$J$$与$$\boldsymbol w$$的模长无关（可以乘个系数带进去试试），不失一般性，设分母为$$1$$，得到下面的优化问题：


$$
\begin{align}
\min\limits_{\boldsymbol w}&~~-\boldsymbol w^\mathrm T \boldsymbol S_b \boldsymbol w\\

\text{s.t.}& ~~\boldsymbol w^\mathrm T\boldsymbol S_w \boldsymbol w = 1

\end{align}
$$


这属于条件最值问题，可以采用Lagrangre乘数法解决。





## 4 多分类和数据不均衡的分类问题



### 4.1 多分类状态下的拆分方法



* 1v1
* 1vR
* MvM（ECOC编码方法）



事实上，在深度学习中，我们只需将模型输出改为一个维度和需要分类的类别相同的向量，然后将分量最大的置为$$1$$，其余的置零即可得到所谓的 One-hot 标注。



> 在看着一段的时候想到了一个说不上相关的例子感觉和ECOC编码有点像：在强化学习中我们需要计算每一个状态的期望奖励函数$$Q(s, a)$$，但在连续的动作空间中我们不能像表格型方法（tabular method）一样将每一个状态的函数值存储起来。（回忆在实数域上的区间尚且是**不可数集**，更不要说更高维的动作空间了）但由于动作空间中向邻近的一块拥有相似的$$Q$$值，我们可以将动作空间化成若干个小块来处理。但这同时又出现了一个问题：如果这个区域设置的太大，显然效果不好；如果区域设置得太小，所占空间又太大。于是就有一种比较聪明的方法：设置一个网眼较大的网格，然后再将这些网格不断地做小偏置，这样就将动作空间划分成了若干个小区域。同时相较于直接这样划分拥有更少的参数量。
>
> <img src="/images/2022-08-13/image-20220819144658111.png" alt="image-20220819144658111" style="zoom:30%;" />



### 4.2 类别不均衡的问题



在上一篇里面我们也谈到了一些类别不均衡问题，这些问题可以采用**代价敏感学习**或**F1-score**来调整模型的表现。但这些似乎有些 “指标不治本” ，因为数据确实对模型来说是 “硬伤”，他不可能通过有限的数据获取足够的泛化信息。（啊…当然…也许我们会疑惑为什么婴儿能够给他一个苹果的照片，而使他/她在遇到苹果时立刻认出这是苹果。有兴趣的读者可以查阅有关**元学习**的内容。）



其实一个比较直接（straightforward）的方法就是：要么把多的变少（**欠采样，undersampling**）（书中提到的EasyEnsemble算法可以在不丢失数据的情况下实现这一点），要么采用某种方法把少的变多（当然不是简单复制）（**过采样，oversampling**）。在实际情况中，可能负例就那么多，没办法再去找了，我们就要考虑如何 “自己造” 出合理的负例。书中提到的是使用插值方法的 SMOTE。根据自己的了解我猜测应该也可以拿**生成对抗网络（GAN）**来做这件事（我觉得较为复杂的问题中如果负例采样点数很少，很难保证线性插值出来的结果有效，我猜那种问题的负例分布长的应该不会太好看….?身边确实也有同学正在这样做，他们面对的是与隐私相关的数据，难以获取）



