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
\sum_f\mathbb E_{ote}[\mathfrak{L_a} \mid X, f] = \sum_f \mathbb E_{ote}[\mathfrak{L_b} \mid X, f]
$$


其中


$$
\mathbb E_{ote}[\mathfrak{L_a} \mid X, f] := \sum_h \sum_{x \in \mathcal X - X} P(x) \cdot \mathbb I(h(x) \ne f(x)) \cdot P(h \mid X, \mathfrak L_a)
$$


和书上一样，我们如果考虑二分类问题，因为算法是任取的，所以会等可能地出现正确和错误两种情形。


所以示性函数这一项可以直接将其变成期望提出来：


$$
\begin{align}

\sum_f\mathbb E_{ote}[\mathfrak{L_a} \mid X, f] =& \sum_f \sum_h \sum_{x \in \mathcal X - X} P(x) \cdot \mathbb I(h(x) \ne f(x)) \cdot P(h \mid X, \mathfrak L_a)\\
=&  \frac 12 \sum_f \sum_h \sum_{x \in \mathcal X - X} P(x)  \cdot P(h \mid X, \mathfrak L_a)\\
=& \frac 12 \sum_f \sum_{x \in \mathcal X - X} P(x) \sum_h   \cdot P(h \mid X, \mathfrak L_a)\\
=& \frac 12 \sum_{x \in \mathcal X - X} P(x) \sum_f \cdot 1\\
\end{align}
$$


那么问题来了，这样的$$f$$到底有多少？我们引入一些定义和不加证明的断言：



> **集合的势**
>
> 如果集合$$A$$为有限集，则集合$$A$$的势为其所含元素的个数，记作$$\mid A \mid $$
>
> 如果集合$$A$$ 可以与自然数集 $$\mathbb N$$ 建立双射，它的势记作 $$\aleph_0$$ 
>
> 两个集合间如果可以建立双射，那么他们的势相同
>
> 有限集以及可以与自然数集建立双射的集合是可数集
>
> 除此之外的集合被称为不可数集 （感兴趣可以证明：$$\mathbb R$$上的闭区间$$[0,1]$$不是可数集）
>
> 
>
> **映射的个数**
>
> 假设存在一个映射$$f: A\rightarrow B$$，那么这样的映射的个数为$$ \mid B \mid ^{\mid A\mid  }$$



这样上面的式子除了中间一项之外其他都是常数，而这显然与算法的选取无关:


$$
\begin{align}

\sum_f\mathbb E_{ote}[\mathfrak{L_a} \mid X, f] =& \sum_f \sum_h \sum_{x \in \mathcal X - X} P(x) \cdot \mathbb I(h(x) \ne f(x)) \cdot P(h \mid X, \mathfrak L_a)\\
=& 2^{|\mathcal X| - 1} \sum_{x \in \mathcal X - X} P(x)\\
\end{align}
$$


**脱离具体问题谈论算法好坏没有意义，就像脱离具体问题谈数据结构的好坏一样。（例如堆和二叉搜索树）**





### 1.2 奥卡姆剃刀原理与泛化性能



**奥卡姆剃刀原理**

如非必要，误增实体。



那问题来了，如何界定何为**必要**，这又是一个麻烦的问题。事实上，书上所给的曲线拟合的例子，在拟合参数变多时，可以通过**正则化（regulization）**或者**增加数据个数**来很好的减轻过拟合的程度



### 1.3 *维度灾难



拿以多项式作为拟合模型的拟合问题为例子，在处理$$f:\mathbb R \rightarrow \mathbb R $$的问题尚且简单，但在处理$$f:\mathbb R^n \rightarrow \mathbb R^m$$的拟合问题时所需参数量快速增加。



**维度灾难的主要体现**

* 高维空间下Euclidean距离失效（以高维球为例，数据据说主要集中在其若干个 “角落” ，而不像三维或更低维度的均匀分布）
* 模型效果变差（我们也可以说，模型的variance变大）



**对策**

* 增加训练样本 
* 选择重要的特征（特征选择算法）
* 降维（比如**主成分分析（PCA）**等）



[更多信息: The Curse of Dimensionality in classification](The Curse of Dimensionality in classification)



## 2 模型选择评估



### 2.1 模型评估方法



* **留出法**——做训练集的一个划分，得到两个互斥的集合，一个作为训练集，一个作为测试集
* **交叉验证法**——做训练集的一个划分，得到若干互斥的集合，轮流地将一个作为测试集，其他作为训练集
* **自助法**——以每次从数据集中随机抽取一个的方式采样多次形成训练集，其余的形成测试集



### 2.2 模型性能度量



**均方误差（<font color="red">M</font>ean <font color="red">S</font>quared <font color="red">E</font>rror）**


$$
\begin{align}
\mathrm{MSE} [f, D] &:= \frac 1m \sum_{i=1}^m (f(x_i) - y_i)^2\\
\mathrm{MSE} [f, \mathcal D] &:= \int_{x \sim \mathcal D} (f(x_i) - y_i)^2p(x) \,\mathrm dx
\end{align}
$$


这可以理解为，两个高维空间中以原点为起点的两个向量之间距离的**度量**，那么很自然的，这个距离越小，模型的表现越好。



**精度（<font color="red">Acc</font>uracy）**



精度的定义更加自然，就是模型在样例集中分类正确的比例


$$
\begin{align}
\mathrm{acc} [f, D] &:= \frac 1m \sum_{i=1}^m \mathbb I(f(x_i) = y_i)\\
\mathrm{acc} [f, \mathcal D] &:= \int_{x \sim \mathcal D} \mathbb I(f(x_i) = y_i)p(x) \,\mathrm dx
\end{align}
$$


**混淆矩阵和P-R曲线**



这主要针对二分类问题进行分析。很显然，二分类问题的结果如果将其表示为二元组$$(model\_output, ground\_truth)$$的形式，那么只有四种情况（考虑核酸检测这一实际情况）：

* $$(T,T)$$——真正例（<font color="red">T</font>rue <font color="red">P</font>ositive）

* $$(T,F)$$——假正例（<font color="red">F</font>alse <font color="red">P</font>ositive）
* $$(F, T)$$——假反例（<font color="red">F</font>alse <font color="red">N</font>egative）
* $$(F,F)$$——真反例（<font color="red">T</font>rue <font color="red">N</font>egative）



于是我们引入以下两个指标：



第一个是将所有事实上是正例的数据中判断正确的比例，称为**精度（precision）或PPV**：


$$
\mathrm{PPV} := \mathrm {\frac{TP}{TP + FN}}
$$


第二个是将所有模型输出为真的数据中分类正确的比例，称为**召回率（recall）或TPR**


$$
\mathrm{ TPR := \frac{TP}{TP + FP}}
$$


但是我们实践中会遇到的一个问题，就是正例和反例的数量严重不等。比如在医学影像处理中，患有某罕见病的病例极少，而正常极多。**如果按照我们之前定义的正确率来比较的话，即使模型 “摆烂” ，把全部的样本全部划为正常，它仍然可以得到很高的正确率，但这显然不是我们想看到的。**如果使用上面的两个指标来刻画模型性能的话，其中某一项会很低，这取决于你将患有某疾病的影像设置为正例还是反例。所以我们寻求一种折中的方法，可以用一个指标来反映两个指标的情况，这就是**F1-score**


$$
\text{F1-score} = \mathrm{\frac{2 \cdot PPV \cdot TPR}{PPV + TPR}}
$$


可以分析，如果亮相中有一项很低，那么就可以使得F1-score很低。这就符合了我们的要求。如果我们想调节二者的权重，只要加一个权重参数再归一化即可。对于多个混淆矩阵的情况，我们可以将精度和召回率取平均值，或者将上面四个基本指标平均之后再计算精度和召回率。



我们还可以将模型的输出按照是正例的可能性从高到低排序，再设计分类阈值，然后逐渐由高到低的降低阈值，可以得到一系列的$$\mathrm{(TPR, PPV)}$$。我们将这些点画在图上，这样可以连成一条曲线，称为**P-R曲线**。我们希望它与坐标轴包围的面积越大越好，这样就说明它的精度和召回率都很高。



<img src="D:/github/hrjtju.github.io/images/2022-08-13/image-20220815120157255.png" alt="image-20220815120157255" style="zoom:33%;" />



另一种评判指标与TPR和FPR有关（FPR类似TPR）二者都关心实际上为真或假的例子被分类正确的比例。采用P-R曲线相似的方法，我们也可以得到一个曲线，称为ROC（<font color="red">R</font>eciever <font color="red">O</font>perating <font color="red">C</font>haracteristic）曲线。



> #### **PR曲线和ROC曲线的关系**
>
> 
>
> 本节转载自[CSDN_THE@JOKER的博客](https://blog.csdn.net/W1995S/article/details/114989313?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-4-114989313-blog-107961184.pc_relevant_multi_platform_featuressortv2removedup&spm=1001.2101.3001.4242.3&utm_relevant_index=7)
>
> 
>
> PR曲线和ROC曲线都能评价分类器的性能。如果分类器a的PR曲线或ROC曲线包围了分类器b对应的曲线，那么分类器a的性能好于分类器b的性能。
>
> 
>
> ##### PR曲线和ROC曲线的联系和不同
>
> 
>
> **相同点：**
>
> * 首先从定义上PR曲线的R值是等于ROC曲线中的TPR值。
>
> * 都是用来评价分类器的性能的。
>
> **不同点：**
>
> * ROC曲线是单调的而PR曲线不是（根据它能更方便调参），可以用AUC的值得大小来评价分类器的好坏（是否可以用PR曲线围成面积大小来评价呢？）。
>
> * 正负样本的分布失衡的时候，ROC曲线保持不变，而PR曲线会产生很大的变化。
>
> （a）（b）分别是正反例相等的时候的ROC曲线和PR曲线
>
> （c）（d）分别是十倍反例一倍正例的ROC曲线和PR曲线
>
>
> <img src="D:/github/hrjtju.github.io/images/2022-08-13/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1cxOTk1Uw==,size_16,color_FFFFFF,t_70.png" alt="在这里插入图片描述" style="zoom:75%;" />
>
> 
>
> 可以看出，在正负失衡的情况下，从ROC曲线看分类器的表现仍然较好（图c），然而从PR曲线来看，分类器就表现的很差。
>
> 事实情况是分类器确实表现的不好（分析过程见[知乎qian lv的回答]()），是ROC曲线欺骗了我们。
>
> 





我们可以将以上数据画成一个表，并计算各个特征数据（图片来源于[维基百科](https://en.wikipedia.org/wiki/Confusion_matrix)）：



<img src="/images/2022-08-13/image-20220815111449691.png" alt="image-20220815111449691" style="zoom:50%;" />



**代价曲线**



对于分类错误不同属性可能造成不同后果的情况，我们可以设置不同的错误分类代价。基于这些代价，我们可以重写代价敏感错误率。

通过与上述两种曲线绘制的方法相似，我们取不同的划分阈值，得到不同的$$\mathrm{(FPR, TPR)}$$二元组，与上面的不同的是，我们以某种方式在图上做出若干直线（每根直线对应一个二元组），最后取所有直线的下界作为边界，就得到了代价曲线。



> ### 有关代价曲线
>
> 
>
> 作者：xf3227
>
> 链接：https://www.zhihu.com/question/63492375/answer/247885093
>
> 来源：知乎
>
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
>
> 
>
> **问题 1：直线（段）或曲线？**
>
> 这个问题仅需[代数](https://www.zhihu.com/search?q=代数&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})知识就可以解决。我们有
>
> 横轴：
>
> 
> $$
> P(+) = \frac{p \cdot cost_{0|1}}{p \cdot cost_{0|1} + (1-p) \cdot cost_{1|0}} \tag 1
> $$
> 
>
> 纵轴：
>
> 
> $$
> cost_{norm} = \frac{\text{FNR} \cdot p \cdot cost_{0|1} + \text{FPR} \cdot (1-p) \cdot cost_{1|0}}{p \cdot cost_{0|1} + (1-p) \cdot cost_{1|0}} \tag 2
> $$
> 
>
> 式（1）[带入式](https://www.zhihu.com/search?q=带入式&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})（2）有：
>
> 
> $$
> cost_{norm} = \text{FNR} \cdot P(+) + \text{FPR} \cdot \big(1 - P(+)\big) \tag 3 
> $$
> 
>
> 将 $$P(+) \in [0,1]$$ 整体看作参数（[自变量](https://www.zhihu.com/search?q=自变量&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})），这是一个线性的参数方程。左端在 $$(0,\text{FPR})$$ ，右端在 $$(1,\text{FNR})$$ 的一条线段。这种参数方程的表述在凸函数的定义中也可以看到，如不熟悉可参阅[凸函数_百度百科](https://link.zhihu.com/?target=https%3A//baike.baidu.com/item/%E5%87%B8%E5%87%BD%E6%95%B0)。
>
> 另，上面的式子中，$$cost_{0|1}$$ 表示：实际为 1 类，而错判成 0 类的代价，即 FN 的代价。下标中间的分割线“|”借用了条件概率的表述方式。
>
> **问题 2：[单根线段](https://www.zhihu.com/search?q=单根线段&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})与横轴之间的（梯形）面积 = 模型对于某一阈值的期望总体代价？**
>
> **一言蔽之，该面积是与代价无关的。**“[期望总体代价](https://www.zhihu.com/search?q=期望总体代价&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})”该命名很容易对理解产生误导。简单地说，给定一个阈值，相应地统计出一个（FPR，FNR）组合，再根据该组合画出一条直线，全程没有用到代价。同时，横轴轴取值范围恒定为 [0,1][0,1][0,1]，故之后的[积分](https://www.zhihu.com/search?q=积分&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})过程也不需要代价概念的参与。
>
> 奇怪的是如果我们把 期望 —— 总体 —— 代价 拆开来一个个说，该命名还是有嚼头的。“期望”和“代价”是针对纵轴而言，毕竟纵轴表示归一化后的代价期望。“总体”是针对横轴，横轴是一个关于正例概率 $$p$$ 的函数，故“总体”指的是所有 $$p \in [0,1]$$。
>
> 对概念的命名是件很难的事情，从不同角度着手理解，一个不完美的[命名](https://www.zhihu.com/search?q=命名&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})可以呈现既合适又不合适的情形。本人斗胆觉得用“期望总体代价”来描述围成面积是不可接受的，**应该命名为“总体错误率”更为妥帖，即模型对于某一阈值的期望总体错误率，即：**
>
> 
> $$
> \int_{p \in [0, 1]} \text{err}(p) \cdot dp \tag{0.1} 
> $$
> 
>
> 其中
>
> 
> $$
> \text{err}(p) = \text{FNR} \cdot p + \text{FPR} \cdot (1-p) \tag{0.2} 
> $$
> 
>
> 值得注意的是，式（0.1）中积分的[微分](https://www.zhihu.com/search?q=微分&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})对象仅仅是正例先验 ppp，而不是式（1）中关于 ppp 的一个非线性函数，如此一来，“总体”该词的实际意义也更加直接。具体原因会在之后展开（详见图一、图二以及相关叙述）。
>
> **问题 3：所有线段围成的下包络线与横轴之间的面积 = 模型对于所有阈值的期望总体代价？**
>
> 同问题 2。既然任一直线的绘制与代价无关，那么所有直线拟出下包络线（即 CC 曲线）也与代价无关。依旧建议命名“总体错误率”，稍许不同的是 $$\text{err}(p)$$ 的表述：
>
> 
> $$
> \text{err}(p) = \inf_{(\text{FNR},\text{FPR}) \in \Omega} \text{FNR} \cdot p + \text{FPR} \cdot (1-p) \tag{0.3} 
> $$
> 
>
> 这里，$$\Omega$$ 指的是一个模型对应的所有（FNR，FPR）的集合，即 CC 空间中所有线段的[端点](https://www.zhihu.com/search?q=端点&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})。$$\inf$$操作对应了寻找下包络线。
>
> 
>
> ------
>
> 
>
> ##### **引入代价的优势**
>
> 
>
> **一个好的“打分”模型，可以将 0 类和 1 类的分数分布完美分隔**。在完美情况下，我们可以在两个分布之间设一个阈值，根据分数大于或是小于该阈值，准确无误地判断输入样本的类别。但现实通常是：0 类和 1 类的分数分布存在重叠，在重叠区间中，任何判断都存在错误的可能。于是，这个**重叠部分的大小就成了评价模型好坏的关键**，ROC 和[代价曲线](https://www.zhihu.com/search?q=代价曲线&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})（CC）应运而生。
>
> 熟悉 ROC 的知友知道，ROC 的绘制大致分为以下几步:
>
> 1. 列出所有“适合”的阈值。
> 2. 对每一个阈值，计算出 TPR，FPR。
> 3. 将所有（TPR，FPR）一一标在 ROC 空间上，并作[线性插值](https://www.zhihu.com/search?q=线性插值&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})以补全间断处。
>
> 从绘制 ROC 乃至最后计算 AUC 的整个过程中，[假 1](https://www.zhihu.com/search?q=假+1&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})（FP）和假 0（FN）皆被同等对待。可是，在很多情况下，FP 和 FN 的后果是不一样的。例如，冤判好人比错放罪犯更令人心寒，高位[满仓](https://www.zhihu.com/search?q=满仓&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})比错过[牛市](https://www.zhihu.com/search?q=牛市&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})跟让人绝望，漏诊重疾相比小题大做更是对病人的不负责。再例如，坐在自动驾驶车里，我宁可希望它刹停在一个子虚乌有的“障碍”前，也不希望它一头冲向路边的电线杆子。这时，我们就需要给 FP 和 FN 设定不同程度的代价，代价曲线（CC）则可以把代价结合到对模型的评价中去。
>
> ## **无/等代价的 CC 空间**
>
> <img src="D:/github/hrjtju.github.io/images/2022-08-13/v2-58ad8483ce264fd77097a3b419631779_1440w.jpg" alt="img" style="zoom:50%;" />
>
> (图一)无/等代价的退化版 CC 空间。纵轴为模型错误率，横轴为正例概率。
>
> 注：纵轴值域截取 [0, 0.5] 以便显示。来源：https://doi.org/10.1145/347090.347126
>
> 
>
> 作者虽然在原论文中空降了 CC 的定义，但是易于理解的思路应该是：ROC 空间 $$\Rightarrow$$ 无/等代价 CC 空间 $$\Rightarrow$$ 不等代价 CC 空间。这里，无/等代价 CC 空间指得是：不引入代价，或者 $$\text{cost}_{0|1} = \text{cost}_{1|0}$$ 的情况。如图一，无/等代价 CC 空间的[纵横轴](https://www.zhihu.com/search?q=纵横轴&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})分别退化为错误率 $$p \cdot \text{FNR} + (1-p) \cdot \text{FPR}$$ 和正例概率 ppp。
>
> <img src="D:/github/hrjtju.github.io/images/2022-08-13/v2-94a687dd3f191139d5b05cd944bbc5ef_1440w.jpg" alt="img" style="zoom:50%;" />(图二)一个实例。
>
> 在图二中，我做了以下几件事情：
>
> 1. 根据两个不同的正态分布（分别代表 0 类和 1 类），随机各取 50 个样本点以模拟它们的模型打分。
> 2. 依据这总共 100 个点绘制 ROC（图二 a）。
> 3. 不引入代价，依据 ROC 绘制退化版 CC（图二 b）。
> 4. 加入代价并令 $$\text{cost}_{0|1}=0.2, \text{cost}_{1|0}=0.4$$，绘制图二 c。此时，虽然纵轴已经依照 CC 空间定义改成[归一化代价](https://www.zhihu.com/search?q=归一化代价&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})，但横轴依旧是正例概率。可以明显看到直线变弯了。
> 5.  在之前的基础上，依照 CC 空间定义再将横轴改成 probability cost（图二 d）。
>
> 实验的结论很明显，图二 b 和图二 d 是一模一样的。事实上，**无论有无代价，还是任意变化代价，对同一个模型来说，其 CC 都是一样的。**既然一样，且看图二 b 和图一，这便是我为何更倾向于命名包络线下面积为“总体错误率”的原因。
>
> 
>
> #### **CC [空间纵轴](https://www.zhihu.com/search?q=空间纵轴&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})定义的动机**
>
> <img src="D:/github/hrjtju.github.io/images/2022-08-13/v2-52bd5eacd259ea984cace939bdd2abf9_1440w.jpg" alt="img" style="zoom:30%;" />
>
> （图三)蓝色为 0 类的分数分布，橙色为 1 类的分数分布。为了简便，故选取正态分布。
>
> 灰色的重叠区域导致了分类的不完美。图三尝试从最简单的情况开始：固定先验正例概率 p=0.5p=0.5p=0.5 ，代价也暂时撇开不谈。试问：如何选取阈值，使得分类尽可能好？**图中的 $$\eta^*$$ 在准确率/错误率意义下给出了最优解**，灰色面积即最小错误率：
>
> 
> $$
> \text{min. err. rate}(p) = p \cdot \text{FNR}(\eta^*(p)) + (1-p) \cdot \text{FPR}(\eta^*(p)) \tag 4 
> $$
> 
>
> 至于为什么最小，左右滑动阈值，想象下灰色区域的变化。不过，这一结论对于一般分布并不一定显然，只有遍历所有阈值才能确保最优。这里，我们把 FNR 和 FPR 写作关于 ppp 的函数，因为它们决定于最优阈值，而最优阈值又决定于 ppp ，详见图四。
>
> <img src="D:/github/hrjtju.github.io/images/2022-08-13/v2-718de50c87e58dbaa6ac09686cffc29e_720w.jpg" alt="img" style="zoom:50%;" />
>
> （图四)分布、重叠区域、最优阈值随 p 的变化。
>
> 接下来引入代价 cost。
>
> <img src="D:/github/hrjtju.github.io/images/2022-08-13/v2-96bd3014b5b869f8477f77089ba87bfa_1440w.jpg" alt="img" style="zoom:30%;" />
>
> (图五)在原有分布上引入了 cost。
>
> 这里 $$\text{min. cost}(p)$$ 是图五中灰色区域：
>
> 
> $$
> \text{min. cost}(p) = \text{FNR}(p) \cdot p \cdot \text{cost}_{0|1}+  \text{FPR}(p) \cdot (1-p) \cdot \text{cost}_{1|0} \tag 5 
> $$
> 
>
> 现在到了[归一化](https://www.zhihu.com/search?q=归一化&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})。图五中，虚线部分已经不能成为分布了，因为各自乘以 cost 后，积分明显小于原来，不再是 1。可以想象，**灰色区域可以随着 cost 的[绝对值](https://www.zhihu.com/search?q=绝对值&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})任意变化，从而丧失了可比性。归一化的一个目的就是为了消除 cost0|1\text{cost}_{0|1}\text{cost}_{0|1} 和 cost1|0\text{cost}_{1|0}\text{cost}_{1|0} 的绝对值对模型评价的影响。一种很自然的归一化思路就是把积分再次拉回 1**。纵向拉伸的[倍率](https://www.zhihu.com/search?q=倍率&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})如下：
>
> 
> $$
> \frac{\text{integral w/ cost}}{\text{integral w/o cost}} =  \frac{\text{integral w/ cost}}{1} \\  = \frac{(1-p) + p}{(1-p) \cdot \text{cost}_{1|0} + p \cdot \text{cost}_{0|1}} =  \frac{1}{(1-p) \cdot \text{cost}_{1|0} + p \cdot \text{cost}_{0|1}} \tag 6
> $$
>  
>
> 很明显，灰色区域也会以该倍率变化。归一化后的灰色区域面积，即模型关于 ppp 的归一化代价为：
>
> 
> $$
> \text{min. norm. cost}(p) = \frac{\text{FNR}(p) \cdot p \cdot \text{cost}_{0|1}+  \text{FPR}(p) \cdot (1-p) \cdot \text{cost}_{1|0}}{p \cdot \text{cost}_{0|1}+ (1-p) \cdot \text{cost}_{1|0}} \tag 7 
> $$
> 
>
> 至此，式（7）就是 CC 空间中的纵轴。
>
> 
>
> #### **CC 空间横轴定义的动机**
>
> 回过头看 ROC 空间中的一个点（TPR，FPR），它又等于（1 - FNR，FPR），易见：CC 空间的中的直线与 ROC 空间中的点是一一对应的。这样的**点/直线“对偶”关系**很优雅，即便从直觉的角度来说，我们也应该在从“等代价”到“不等代价”的推广过程中极力保障这个性质。关键就是要“直”，可以给后续分析、模型评价带来极大便捷。所以呢，为了**配合纵轴的归一化思路**，唯有对横轴作这样的操作才可确保直线。
>
> 
>
> ##### **如何让包络线下面积蕴含代价**
>
> 包络线直接对 ppp 而不是对式（1）做积分应该是一种体现代价的方法。启发源于 
>
> [@HY Scatterer](http://www.zhihu.com/people/e9ba338de955d3e6fe2314c4c4123929)
>
>  的答案，虽不知理解得对不对，但是鉴于 HYScatterer 知友的实验结果：CC AUC 会随着 [cost ratio](https://www.zhihu.com/search?q=cost+ratio&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093}) 变化这一点，我觉得他应该是对着一个“均匀尺度”的变量做积分了。原定义中，横轴是关于 ppp 的一个非线性函数，相当于对“天然”横轴的 ppp 做了一个[非线性缩放](https://www.zhihu.com/search?q=非线性缩放&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A247885093})，而这个缩放是会随着 cost ratio 改变的。
>
> 
>
> ## CC 相比于 ROC 有什么优势
>
> 1. CC 能可视化代价。
> 2. CC 的纵轴给出了我们对模型最关心的指标：代价或者错误率。且撇开 ROC 的短板 —— 代价不说，仅就错误率而言，CC 上一目了然的事情，在 ROC 空间里并不方便，每拉出一个点，至少得心算一次加法，一次减法。
> 3. CC 的纵轴与先验 ppp 直接相关。通常情况下，先验与样本中的频率并不相同。CC 可以展示模型在各个 ppp 情况下的表现，也是 ROC 所不及的。
>
> 最后想说的是，CC 的应用远不及 ROC。鉴于本人有限的阅读量，我觉得至少在机器学习的论文中鲜有用 CC 或 CC AUC 做模型指标的。就目前来说，和 CC 有关的文献大多是原作者 C. Drummond 和 R. C. Holte 自己写的。教材、参考书如西瓜书囊括入代价曲线主要是为了内容完整性。总之，哪怕是 CC 的定义目前也没有金科玉律，在使我最早接触代价曲线的教材上，CC 的定义里甚至都没有引入归一化。不论是怎样的回答只要是自洽，就够令人满意了。







### 2.3 * “ P=NP ” ？ 



$$P$$指多项式时间内，计算机可以花有多项式时间解决并验证的问题（easy to find），$$NP$$指不一定能在多项式时间内解决，但可以在多项式时间内验证的问题（easy to check）







### 2.4 调参（~~炼丹~~）
