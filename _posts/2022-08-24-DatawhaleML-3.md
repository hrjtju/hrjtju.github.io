---
layout: post
categories: posts
title: 【DatawhaleML】 3 决策树和神经网络
subtitle: Datawhale开源学习社区机器学习项目笔记
featured-image: /images/2016-11-19/abstract-1.jpg
tags: [Machine Learning]
date-string: AUGUST 24, 2022

---



### 1 决策树算法



我们在写程序时也会用到许多的分支语句。而这些分支语句也常常是嵌套的。决策树算法和这个类似。它通过每个训练数据的标签，给出一个**树**，其中的每一个节点是一个判定标准。数据经过这样的标准后将被分割为若干个部分。当然我们最后期望每一个划分的那一些数据尽可能都是同一类的，或者说 “纯度” 要尽量的高。



下面递归的给出决策树算法^[1]^：

<img src="/images/2022-08-13/image-20220829132735266.png" alt="image-20220829132735266" style="zoom:50%;" />

但我们很容易注意到一点：该算法中并没有提及如何判定一个属性是不是最优的。这也是接下来需要讨论的问题



### 2 划分选择的依据



我们在确定每一个节点的划分标准时，需要确定一个使得划分后 “分的最开” 的一个指标。试想如果想要分开一堆形状相同红球和蓝球，按照形状分就完全没有用处。这不是我们所希望的。如何判定这样的指标是否能将样本分的最开，这需要引入像信息这样的概念。



#### 2.1 信息论



引用知乎上一篇回答的说法。常胜的国乒队如果在一场与非乒乓球强队的比赛中胜出，这是符合每一个人预期的。而如果在比赛中输给了对方，那么造成的影响将会很大。这像是事件发生概率越低，其中所含的信息量越大。因此我们这样定义信息量：


$$
\mathrm H(x) := -\log x
$$


在经过决策树一个节点分类后的得到的若干个数据集合，我们自然希望其所蕴含信息的**确定性**更高。因为我们最终希望的是决策树给出一个较为确定的结果。由于上式中$$x$$是介于$$0$$和$$1$$中的概率值，我们可以在一个含有多种信息中的集合中类比热力学中的熵的概念定义其**信息熵**，即信息的杂乱或不确定程度：


$$
\mathrm{Ent}(D) := -\sum_k p_k\log p_k
$$


对于一些极端的情况，我们约定$$0\log0=0$$（这看起来不正确，但我们可以将其看作令$$p_k$$趋于$$0$$的结果）。可以证明，集合$$D$$的信息熵在其中全都是某一种类型时达到最小值$$0$$，在每种类型占比相同时达到最大。因此很容易想到的一个解决方法是，**选择那个将信息熵降低的最大的那一个指标作为这个节点的分类指标就好了**。



#### 2.2 信息增益



我们这样定义**信息增益**：划分前的信息熵减去划分后信息熵按照每一个集合的势的加权和：


$$
\mathrm{Gain}(D, a) := \mathrm{Ent}(D) - \sum_v \frac{\mid D^v\mid}{\mid D\mid} \mathrm{Ent}(D^v)
$$


**ID3算法**就是按照最小化信息增益的方法生成决策树的。显然生成结果是一颗**二叉树**。

可能读者会意识到一点，考虑如下的极端情况：假设数据集中的某个指标在每个数据中的值都不相同，我们直接选择这一个指标，然后将每一个数据分成一类，不就一劳永逸了吗？但要记住的是，这样可能会极大降低模型的泛化性能。在实际情况中我们也更偏好分类较少的那一个选择。于是我们又定义了**增益率**的概念，将分类后集合个数也纳入考虑范围：


$$
\mathrm{Gain\_ratio}(D,a) := \frac{\mathrm{Gain}(D, a)}{\mathrm{IV(a)}}
$$


其中$$\displaystyle \mathrm{IV}(a)$$为该属性的**固有值**，和属性$$a$$的取值数目正相关：


$$
\mathrm{IV}(a) := -\sum_{v} \frac{\mid D^v\mid}{\mid D\mid} \log \frac{\mid D^v\mid}{\mid D\mid}
$$


我们可以形象的将其认为是 “划分本身的信息熵”。 要使得增益率高，在信息增益相同的前提下，我们自然希望属性的固有值低。



#### 2.3 Gini指数



另一种方式是**Gini指数**。我们先对**Gini值**做定义：


$$
\mathrm{Gini}(D) := \sum_k\sum_{k' \ne k} p_kp_{k'} = 1-\sum_{k} p_k^2
$$


Gini值指征随机从数据集中抽取两个数据，标注不同的概率。自然这样的概率越小，说明集合的 “纯度” 越高。与信息增益类似，我们也可以对划分后的Gini值的加权和，也即**Gini指数**做定义：


$$
\mathrm{Gini\_index}(D, a) := \sum_v \frac{\mid D^v\mid}{\mid D\mid} \mathrm{Gini}(D^v)
$$


**CART算法**就是采用这一个指标选择划分依据的



#### 2.4 CART



TODO



#### 2.4* QUEST



TODO



#### 2.5 **CHAID**



这个板块在正文中未提及，但因查得的资料中经常提起它，于是将其单独作为一个板块写出。回忆在统计学中的**卡方检验**，卡方统计量$$\chi^2$$越大，表示统计量之间的存在联系的可能性越大。统计学中的**F检验**，也可以做到类似的目的。在CHAID算法中这两种检验分别针对离散（卡方）和连续（F）指标的情况。

在选择节点的分类指标的时候不想上述的算法一样，而是直接通过统计的方法判定这些属性指标与目标属性（也就是数据集的标签）的相关程度，然后**选择与标签相关程度最大的那一个指标作为划分依据**。





### 3 处理连续值与缺失值



走到这一步我们可能要处理一些特殊的情况（从某种角度来看，我们在上面提到的才是特殊的情况啊喂）。这些 “特殊的” 情况就是连续值和缺失值的情况。

对于连续值的情况，一个自然的想法就是离散化。确定一个阈值，将超过阈值的归为一类，剩下的归为另一类。那么我们如何度量这样分类的诸如信息增益这样的指标？**我们可以将该指标散布的区间分成若干小段，然后遍历这些断点，将信息增益最大的那个断点记住，最大的信息增益作为以这个属性指标为依据的信息增益。如果这个增益是最大的，那么就以之前记住的那个阈值作为实际的划分阈值。**使用其他判别方法也类似。

缺失值的处理较为复杂。例如给定数据集$$D$$和属性$$a$$，我们知道数据集中的某些数据有这个属性的记录：

* 将这些没有缺失属性$$a$$的数据构成的集合记为$$\tilde D$$
* 假设$$a$$可以取得集合$$\{a^1,a^2,...,a^V\}$$中的任意值，我们记$$\tilde {D^v}$$为没有缺失属性$$a$$的数据中属性$$a$$取值为$$a_v$$的所有数据组成的集合
* 将没有缺失属性的集合中属于第$$k$$类的数据组成的集合记为$$\tilde D_k$$
* 并赋予每一个样本$$\boldsymbol{x}$$一个权重$$w_{\boldsymbol{x}}$$

我们在定义下面几个参量：



* $$\displaystyle \rho := \frac{\sum_{x \in \tilde D} w_{\boldsymbol{x}}}{\sum_{x \in D} w_{\boldsymbol{x}}}$$，这个参数指征加权后的**未缺失指标数据**的 “占比”



* $$\displaystyle \tilde p_k := \frac{\sum_{x \in \tilde D_k} w_{\boldsymbol{x}}}{\sum_{x \in \tilde D} w_{\boldsymbol{x}}}$$，这个参数指征**标签为$$k$$的未缺失指标**的加权占比



* $$\displaystyle \displaystyle \tilde r_v := \frac{\sum_{x \in \tilde {D^v}} w_{\boldsymbol{x}}}{\sum_{x \in \tilde D} w_{\boldsymbol{x}}}$$，这个参数指征**属性值为$$v$$的未缺失指标**的加权占比



**信息增益的情况**



这样我们可以定义广义下的的信息增益：


$$
\mathrm{Gain}(D, a):= \rho \cdot \mathrm{Gain}(\tilde D, a) = \rho \cdot \left( 
\mathrm{Ent}(\tilde D) - \sum_v \tilde r_v \mathrm{Ent}(\tilde {D^v})
\right)
$$


其中


$$
\mathrm{Ent}(\tilde D) := -\sum_k \tilde p_k\log \tilde p_k
$$


这样的处理就像我们将那些缺失标签的数据当作是 “占位符”，虽然没有标签，但要参与最终信息增益的计算。最后这些没有标签的数据被原封不动的移到每一个划分后的集合中。



**Gini指数的情况**

书上将此作为一个习题。在此提出我的一个想法。若有不当之处敬请指正。首先将Gini指数中的$$p_k$$换为$$\tilde p_k$$，再将比值部分换为$$\tilde r_v$$


$$
\mathrm{Gini}(D) := \rho \cdot \mathrm{Gini}(\tilde D) = \sum_k\sum_{k' \ne k} \tilde p_k\tilde p_{k'} = 1-\sum_{k} \tilde p_k^2
$$

$$
\mathrm{Gini\_index}(D, a) := \sum_v \tilde r_v \mathrm{Gini}(D^v)
$$

### 4 剪枝



决策树和其他的机器学习算法一样，稍有不慎就容易产生过拟合的情况。原因是模型注意到了一些本不应该是正确判定类别的**特征**。就像我们在背英语单词的时候通过卡片的颜色来想起单词的内容，而考试时的卷子永远是白色的一样。体现在决策树算法中就是树的高度或者说一些子树太高了（树的高度我们可以用**深度优先搜索（Depth First Search）**完成），因此我们要有一个 “剪枝” 的动作来一定程度上抑制过拟合的现象。



**预剪枝**



顾名思义，就是在模型练好之前实施剪枝操作。方法是在创建不是最终的叶节点的节点之前比较创建节点（也就是按照某种属性来进行分类）之前测试模型的泛化性能。如果划分后的泛化性能严格大于划分之前的泛化性能，那么就执行划分操作，否则停止划分操作，并将这个集合的标签设置为占比最大的那一类数据的标签。



**后剪枝**



相对地，后剪枝在决策树生成后不断的尝试：如果这个节点没有划分泛化性能将会受到什么影响？如果不划分泛化性能更高，那么这个节点直接变成叶节点。



### 5 随机森林



对于过拟合的情况的另一种解决方法就是 “大力出奇迹”，如果产生若干棵不同的决策树，然后**让它们对结果进行投票，票数最多的就是整个模型的输出**。

在生成不同的决策树方面我们可以采取如下的方法：

* 每次生成时总是抽取一定量的数据而不是直接使用全部训练集
* 每次尝试划分时总是从随机抽取的一小部分属性中选择划分属性



> #### **随机森林的优缺点^[5]^**
>
> 版权声明：本文为CSDN博主「想变厉害的大白菜」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
>
> 
>
> ##### *优点*
>
> * 它可以处理很高维度（特征很多）的数据，并且不用降维，无需做特征选择
> * 它可以判断特征的重要程度
> * 可以判断出不同特征之间的相互影响
> * 不容易过拟合
> * 训练速度比较快，容易做成并行方法
> * 实现起来比较简单
> * 对于不平衡的数据集来说，它可以平衡误差。
> * 如果有很大一部分的特征遗失，仍可以维持准确度。
>
> ##### *缺点*
>
> * 随机森林已经被证明在某些噪音较大的分类或回归问题上会过拟合。
> * 对于有不同取值的属性的数据，取值划分较多的属性会对随机森林产生更大的影响，所以随机森林在这种数据上产出的属性权值是不可信的







---



### 6 感知机算法



回忆之前学过的神经元模型，在超过阈电位时的神经元会产生兴奋。感知机就是仿照神经元这样的特性来设计的。我们称为 **M-P神经元模型**。从数学上讲，就是感知机对输入进行加权和，最后再让某一个激活函数$$f$$作用于这个和上，得到感知机的输出：


$$
y = f\left( \sum_i w_ix_i - \theta \right)
$$


这和之前提到的广义线性模型有些相似，但注意到神经元的一个特点：大脑是由很多个神经元组成在一起的。上述的感知机也可以进行相互连接，组成一个巨大的网络，我们称之为**神经网络**。一个事实是，例如异或这样的问题是没有办法线性可分的（除非把他加一维），因为我们不能在二维平面上画一条直线，将正例和负例完全分开。但是我们可以用多个感知机来完成这一点。（详见西瓜书，这里就不再赘述了）更一般的是将感知机或神经元层叠起来，形成一层一层的结构，这就构成了神经网络的层。每一层可以规定不同来源输入的权值。将视角放大到这一整层，就可以看作是一个$$1 \times m$$维向量与形状为$$m \times n$$的矩阵相乘，得到一个新的$$n$$维向量。



### 7 误差反向传播



我们将每层的输出仅决定于当层的输入的神经网络叫做**前馈神经网络**，可以看出，这样的神经网络是一个巨大的复合函数。我们进行梯度下降法时，需要求损失函数对参数矩阵的偏导数，这样使用**链式法则**就可以办到。但是有时求某些激活函数的偏导数较为复杂，这需要我们找到一个易于求偏导数的激活函数。回忆我们在Logistic回归时提到的sigmoid函数，它的偏导数具有一些有趣的性质：


$$
\sigma'(x) = \sigma(x)(1 - \sigma(x))
$$


这样我们就可以不用其他繁琐的方式进行求导，可以直接通过函数值来推出导数值，使得计算得到简化。有关于何时更新，这也是一个问题。有两种极端的办法。一是在看完所有的数据后更新，二是每看一个数据更新一次。前者没有不同数据见造成的参数更新抵消的问题，但可能会训练缓慢；后者虽然更新频繁，但会在局部最小值的附近不断震荡。一种折中的方法就是所谓的**小批量（mini-batch）梯度下降法**。可以兼具以上两种方法的优点。现在我们在训练神经网络的过程中也确实最常用小批量梯度下降法。



#### **学习率的问题**



在训练过程中，有一些需要人为指定的参数，叫做**超参数**。比如神经网络有多少层、每层的输入和输出是多少、模型训练的迭代次数、神经元是否有偏置、选择什么样的激活函数、学习率的确定等等。

可能一些超参数的改变会对模型的最终训练结果产生显著的影响。在此我们以学习率做例子。

我们知道在进行梯度下降算法的时候会遇到几个问题：一是学习率太大会导致模型发散（梯度爆炸），学习率太小又训练缓慢（梯度消失）的问题；二是即使设定了一个合适的学习率，却很容易卡在某些特殊点上：比如鞍点、局部最小值。



> 不过值得注意的是，梯度消失和梯度爆炸也不仅是由于学习率设置的问题。例如采用sigmoid函数时会出现这样的问题，在RNN中，后面输入的数据对模型参数变化的影响要比前面输入的数据对模型变化的影响要大（一般来说）（因为在计算前面的参数的时候需要更多的链式法则中的乘积项），这也是后来出现的GRU以至LSTM致力于解决的问题



为了解决这些问题，人们想出了多种优化算法，下面列举其中较为有名的两种。



**Adagrad**


$$
\begin{aligned}
            &\overline{\kern{25em}}                                                                \\
            &\textbf{input}      : \gamma \text{ (lr)}, \: \theta_0 \text{ (params)}, \: f(\theta)
                \text{ (objective)}, \: \lambda \text{ (weight decay)},                          \\
            &\hspace{12mm}    \tau \text{ (initial accumulator value)}, \: \eta\text{ (lr decay)}\\
            &\textbf{initialize} :  state\_sum_0 \leftarrow 0                             \\[-1.ex]
            &\overline{\kern{25em}}                                                                \\
            &\textbf{for} \: t=1 \: \textbf{to} \: \ldots \: \textbf{do}                         \\
            &\hspace{5mm}g_t           \leftarrow   \nabla_{\theta} f_t (\theta_{t-1})           \\
            &\hspace{5mm} \tilde{\gamma}    \leftarrow \gamma / (1 +(t-1) \eta)                  \\
            &\hspace{5mm} \textbf{if} \: \lambda \neq 0                                          \\
            &\hspace{10mm} g_t \leftarrow g_t + \lambda \theta_{t-1}                             \\
            &\hspace{5mm}state\_sum_t  \leftarrow  state\_sum_{t-1} + g^2_t                      \\
            &\hspace{5mm}\theta_t \leftarrow
                \theta_{t-1}- \tilde{\gamma} \frac{g_t}{\sqrt{state\_sum_t}+\epsilon}            \\
            &\overline{\kern{25em}}                                                         \\[-1.ex]
            &\bf{return} \:  \theta_t                                                     \\[-1.ex]
            &\overline{\kern{25em}}                                                         \\[-1.ex]
       \end{aligned}
$$


**Adam**


$$
\begin{aligned}
            &\overline{\kern{25em}}                                                                \\
            &\textbf{input}      : \gamma \text{ (lr)}, \beta_1, \beta_2
                \text{ (betas)},\theta_0 \text{ (params)},f(\theta) \text{ (objective)}          \\
            &\hspace{13mm}      \lambda \text{ (weight decay)},  \: \textit{amsgrad},
                \:\textit{maximize}                                                              \\
            &\textbf{initialize} :  m_0 \leftarrow 0 \text{ ( first moment)},
                v_0\leftarrow 0 \text{ (second moment)},\: \widehat{v_0}^{max}\leftarrow 0\\[-1.ex]
            &\overline{\kern{25em}}                                                                \\
            &\textbf{for} \: t=1 \: \textbf{to} \: \ldots \: \textbf{do}                         \\

            &\hspace{5mm}\textbf{if} \: \textit{maximize}:                                       \\
            &\hspace{10mm}g_t           \leftarrow   -\nabla_{\theta} f_t (\theta_{t-1})         \\
            &\hspace{5mm}\textbf{else}                                                           \\
            &\hspace{10mm}g_t           \leftarrow   \nabla_{\theta} f_t (\theta_{t-1})          \\
            &\hspace{5mm}\textbf{if} \: \lambda \neq 0                                           \\
            &\hspace{10mm} g_t \leftarrow g_t + \lambda  \theta_{t-1}                            \\
            &\hspace{5mm}m_t           \leftarrow   \beta_1 m_{t-1} + (1 - \beta_1) g_t          \\
            &\hspace{5mm}v_t           \leftarrow   \beta_2 v_{t-1} + (1-\beta_2) g^2_t          \\
            &\hspace{5mm}\widehat{m_t} \leftarrow   m_t/\big(1-\beta_1^t \big)                   \\
            &\hspace{5mm}\widehat{v_t} \leftarrow   v_t/\big(1-\beta_2^t \big)                   \\
            &\hspace{5mm}\textbf{if} \: amsgrad                                                  \\
            &\hspace{10mm}\widehat{v_t}^{max} \leftarrow \mathrm{max}(\widehat{v_t}^{max},
                \widehat{v_t})                                                                   \\
            &\hspace{10mm}\theta_t \leftarrow \theta_{t-1} - \gamma \widehat{m_t}/
                \big(\sqrt{\widehat{v_t}^{max}} + \epsilon \big)                                 \\
            &\hspace{5mm}\textbf{else}                                                           \\
            &\hspace{10mm}\theta_t \leftarrow \theta_{t-1} - \gamma \widehat{m_t}/
                \big(\sqrt{\widehat{v_t}} + \epsilon \big)                                       \\
            &\overline{\kern{25em}}                                                         \\[-1.ex]
            &\bf{return} \:  \theta_t                                                     \\[-1.ex]
            &\overline{\kern{25em}}                                                         \\[-1.ex]
       \end{aligned}
$$


可以看到，前者采用的是让学习率越来越小的方法，而后者则加入了所谓的**动量（momentum）**，使得优化器可以直接跳出一些局部极小值。这样就一定程度上减轻了训练后期的梯度消失问题。



#### 防止过拟合



神经网络由于**万有逼近定理**而容易产生过拟合现象。我们在训练过程中通常采用如下几种方法来抑制过拟合现象。



**Early Stopping**

顾名思义，就是在认为模型表现得足够好时终止训练。如果不终止训练，模型容易 “走火入魔”，出现过拟合现象，从而提高泛化误差。



**Dropout**

对于神经网络的一些特定层，我们可以设置一个比例$$\gamma$$，使得该层总是有占比为$$\gamma$$的神经元停止工作。这样防止过拟合的同时又充分的训练了该层的所有神经元。



**正则化**

我们向损失函数中加入一个惩罚项，这个惩罚项刻画模型的复杂度。常用的两个惩罚项是L2范数（这成为Ridge Regression）和L1范数（称为Lasso Regression）。前者倾向于降低所有参数的值，而后者倾向于减少非零参数的数量。



#### 局部最小值



这是一个采用梯度下降算法常常会遇到的问题。如同我们行走在山中，我们只能通过自己的所见来判断自己是高还是低；而不知道自己视野之外的景象。书中提供了以下几个方法：



* 从不同的初始点开始梯度下降，也就是参数采用不同的初始化
* 使用**模拟退火（simulated annealing）算法**，即每一步都有概率接受比当前更差的结果（这有点像强化学习中的**$$\varepsilon$$-贪心（$$\varepsilon$$-greedy）算法** ）
* 使用**随机梯度下降算法**，模型在逼近局部最小值时仍有几率跳出局部最小值。
* 使用**遗传算法**。



但以上都是启发式算法，缺乏严谨的理论证明。



### 8 RBF 网络



#### 8.1 RBF 

RBF(Radial Basis Function) 是一个函数空间中的**基**。这些基满足如下性质：


$$
\varphi(x) = \varphi(\|x - c\|)~, \text{for some}~c
$$


它与$$x$$与$$c$$之间的 “距离” 有关。因此也叫**径向基函数（RBF）**。例如Gauss函数：


$$
\varphi_{\mu, \sigma}(x) =\frac 1 {\sqrt{2\pi}}\exp\left\{ -\frac{(x - \mu)^2}{2\sigma^2} \right\}
$$


那么我们希望我们拟合的目标$$f$$可以写成或足够接近


$$
g(x) = a_0 + \sum_i a_i \varphi_{\mu_i, \sigma_i}(x)
$$


#### 8.2 RBF运用于神经网络

注意到正态分布的性质，如果令径向基函数就是Gauss函数，容易知道


$$
\varphi_{\mu, \sigma}(x) = \varphi_{0, 1}\left(\frac 1\sigma \cdot x - \frac \mu\sigma\right) = \varphi_{0, 1}(ax + b)
$$


这与感知机的计算公式相类似。即为一个拥有单隐藏层的神经网络





### 9 竞争神经网络



我们也可以换种思路考虑神经网络的问题。我们让神经元之间产生竞争，从而总是让预测某一类数据效果最好的那一个神经元去预测那一类数据。这就是**竞争神经网络**。我们以度量二维向量之间的夹角为例。首先将每一个神经元的权向量归一化，这样所有权向量都落在了单位圆上。

我们再将输入归一化，然后检查与输入向量夹角最小的那一个权向量。如果两个向量的夹角小于某一个阈值，那么取这个向量的更新结果，单独更新这一个神经元的参数。这就是**胜者通吃（winner-take-all）原则**。如果距离输入向量最近的那一个权向量都不够接近（也就是没有超过阈值）那么就增加一个神经元，使得这个神经元的权向量就等于输入向量。

在多分类任务中，训练这样的网络会使得权向量发生**逐步的 “分化”**，即不同的向量分别担任不同类的预测任务。在阈值的设置上，较大的相似度阈值会将数据集更加细分。而较小的阈值可能会将距离较近的两类误认为是一类。



### 10 SOM 网络







### 11 级联相关网络



### 12 Elman 网络



### 13 Boltzmann 机



### 14 图神经网络（GNN）

TODO



### 15 脉冲神经网络



### 16 深度学习



### 0 参考文献

[1] Yajing, Zhang & Chi, Guotai & Zhang, Zhipeng. (2018). Decision tree for credit scoring and discovery of significant features. Filomat. 32. 10.2298/FIL1805513Z. 

[2] https://rpubs.com/chidungkt/451329

[3] https://towardsdatascience.com/clearly-explained-top-2-types-of-decision-trees-chaid-cart-8695e441e73e

[4] https://zhuanlan.zhihu.com/p/470170165

[5] https://blog.csdn.net/weixin_44211968/article/details/125722469

[6] https://zhuanlan.zhihu.com/p/413596878





<iframe src="//player.bilibili.com/player.html?aid=842789414&bvid=BV1K54y1k7sV&cid=257631072&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
