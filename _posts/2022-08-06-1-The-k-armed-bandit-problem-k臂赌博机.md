---
layout: post
categories: posts
title: 1 The k-armed bandit problem, k臂赌博机
subtitle: Intro to RL and k-armed bandit problem
featured-image: /images/2016-11-19/abstract-5.jpg
tags: [Reinforcement Learning]
date-string: AUGUST 06, 2022

---



## 1 k-臂赌博机



> Reinforcement Learning is to choose **a series of actions** to maximize the **total expected reward**, By **trial and error**, under **uncertainty**.



想象这样一个场景：我们到达一个之前没有去过的餐馆准备吃饭。我们准备从$$k$$种菜里面选一种作为今天晚上的主菜。假设我们没有查阅其他人对这家餐馆的评论，那么，在我们之后多次光顾这家餐馆的情况下，我们如何做到在餐馆中的体验最好？（我们在此做一个极端假设，即我们中的每一个人对每一道菜的看法相同）



在上述场景中，我们称我们的选择为一个**动作（action）**，记作$$a$$；而在选择之后我们对菜的看法（如同美食节目中对菜打分）称为我们获得的**奖励（reward）**，记作$$r$$。由于餐馆厨师做菜水平在每一次并不是完全相同的，因此我们可以将选取特定菜所得的奖励的平均值记下来：


$$
q_*(a) := \mathbb E[R_t=r|A_t=a]
$$


然而真正的$$q_*(a)$$是难以得知的。否则我们在首次来到这家餐馆时就可以直接选出我们认为最好的菜。因此，我们需要通过我们**不断的尝试**各种菜所得的奖励来**估计**真实的期望值：


$$
Q_t(a) := \frac{\sum_{i=1}^{t-1} R_i\cdot \mathbb 1_{A_i=a}}{\sum_{i=1}^{t-1} \mathbb 1_{A_i=a}}
$$


由**大数定律**，容易知道当分母趋于无穷大时，$$Q_t(a) \rightarrow q_*(a)$$。那么我们就可以很好的估计真实的奖励的期望值。那我们只要直接选择那个使得$$Q_t(a)$$的值最大的那一个就好了……真的是这样吗？





## 2 探索与利用之两难



我们在餐厅点菜，我们可以一直点自己喜欢吃的那一道菜（事实上在现实中我就是这样做的），也可以试试其他的。





