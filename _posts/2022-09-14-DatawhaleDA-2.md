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



### 2.2 数据重构



### 2.3 数据可视化
