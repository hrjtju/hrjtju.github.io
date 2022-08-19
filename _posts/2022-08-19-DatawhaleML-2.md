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


其中$$\boldsymbol {\hat w} = (\boldsymbol {w}; b) $，$\boldsymbol {X} = \begin{align} \left[\boldsymbol {x_1^\mathrm T}, 1; \boldsymbol {x_2^\mathrm T}, 1;...  \boldsymbol {x_n^\mathrm T}, 1; \right] \end{align}$$。我们对需要优化的式子进行求导：


$$
\frac{\part E_\hat w}{\part \hat w}  = 2 \boldsymbol{X}^\mathrm T (\boldsymbol{X}\boldsymbol{\hat w} - \boldsymbol{y})
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
> 其中$$~|~\mathcal{B}~|~$$ 表示一个小批量的大小。这也叫做**小批量梯度下降**。因为梯度总是指向函数值变化 “最快” 的方向，于是我们可以利用这一点来逐步逼近损失函数的局部最小值。注意在这个例子中损失函数是凸函数，所以我们使用这个方法总会收敛到全局最小值。（当然是在选取合适的**学习率**$$\eta$$的前提下）
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
接下来使用梯度下降或者其他方法均可。



> ### Newton法
>
> 
>
> 
>
> 
>
> 
>
> 
>
> 
>
> 
>
> 
>
> 





## 3 线性判别分析（<font color="red">L</font>inear <font color="red">D</font>iscriminant <font color="red">A</font>nalysis）





## 4 多分类和数据不均衡的分类问题



