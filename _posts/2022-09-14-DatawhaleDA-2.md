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



```python
# 方法2, 返回值类型为 pandas.core.series.Series

df.isna().sum(axis=0)
```

<img src="/images/2022-09/image-20220914082711202.png" alt="image-20220914082711202" style="zoom:50%;" />

```python
# 方法3，直接调用之前的函数

df.info()
```

<img src="/images/2022-09/image-20220914082721734.png" alt="image-20220914082721734" style="zoom:50%;" />

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



由于有了这样的功能支持，我们也可以对任何一列做某种变换，使得我们可以借此得到我们想要的数据。例如问题中给出的筛选`Miss`等这样的字串，我们很自然的想到了正则表达式。所提取的规则是：两个字符以上（实际上测试过一个字符及以上的，结果发现和两个字符及以上结果一样），以大写字母开头，以点结束。因此我们可以写出正则表达式字符串（在此默认读者有正则表达式的基础知识，故不再对正则表达式逐个字符进行解释）：

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



**数据合并**

先介绍一个函数`pd.concat()`先看[文档](https://pandas.pydata.org/pandas-docs/stable/user_guide/merging.html)中的描述：

```python
pd.concat(
    objs,
    axis=0,
    join="outer",
    ignore_index=False,
    keys=None,
    levels=None,
    names=None,
    verify_integrity=False,
    copy=True,
)
```

- **`objs`** : a **sequence or mapping** of Series or `DataFrame` objects. If a `dict` is passed, the sorted keys will be used as the `keys` argument, unless it is passed, in which case the values will be selected (see below). <u>Any `None` objects will be dropped silently unless they are all None in which case a `ValueError` will be raised.</u>
- **`axis`** : `{0, 1, …}`, default `0`. The axis to concatenate along.
- **`join`** : `{‘inner’, ‘outer’}`, default `‘outer'`. How to handle indexes on other axis(es). **Outer for union and inner for intersection.**
- **`ignore_index`** : boolaean, default `False`. If `True`, do not use the index values on the concatenation axis. The resulting axis will be labeled `0, …, n - 1`. <u>This is useful if you are concatenating objects where the concatenation axis does not have meaningful indexing information.</u> Note the index values on the other axes are still respected in the join.
- `keys` : sequence, default `None`. Construct hierarchical index using the passed keys as the outermost level. If multiple levels passed, should contain `tuples`.
- `levels` : list of sequences, default `None`. Specific levels (unique values) to use for constructing a MultiIndex. Otherwise they will be inferred from the `keys`.
- `names` : list, default None. Names for the levels in the resulting hierarchical index.
- `verify_integrity` : boolean, default `False`. Check whether the new concatenated axis contains duplicates. This can be very expensive relative to the actual data concatenation.
- **`copy`** : boolean, default `True`. If `False`, do not copy data unnecessarily.



下面以文档中的一个例子对各参数进行说明：

*初始化*

```python
df1 = pd.DataFrame(
    {
        "A": ["A0", "A1", "A2", "A3"],
        "B": ["B0", "B1", "B2", "B3"],
        "C": ["C0", "C1", "C2", "C3"],
        "D": ["D0", "D1", "D2", "D3"],
    },
    index=[0, 1, 2, 3],
)


df2 = pd.DataFrame(
    {
        "A": ["A4", "A5", "A6", "A7"],
        "B": ["B4", "B5", "B6", "B7"],
        "C": ["C4", "C5", "C6", "C7"],
        "D": ["D4", "D5", "D6", "D7"],
    },
    index=[4, 5, 6, 7],
)


df3 = pd.DataFrame(
    {
        "A": ["A8", "A9", "A10", "A11"],
        "B": ["B8", "B9", "B10", "B11"],
        "C": ["C8", "C9", "C10", "C11"],
        "D": ["D8", "D9", "D10", "D11"],
    },
    index=[8, 9, 10, 11],
)

frames = [df1, df2, df3]
```

*直接连接*

```python
pd.concat(frames)
```

因为上述三个`DataFrame`的行索引并没有相交，于是很自然的可以得出结果。`axis`默认为`0`，于是三个表进行纵向连接。如果每个表的纵向索引都是`[1, 2, 3, 4]`，`pandas`将不会做什么额外的工作，它将直接将这三张表串起来：

<img src="../images/2022-09/image-20220915104958638.png" alt="image-20220915104958638" style="zoom:50%;" />

```python
pd.concat(frames, ignore_index=True)
```

如果将`ignore_index`改为`True`，`pandas`将会重新编号

<img src="../images/2022-09/image-20220915105238498.png" alt="image-20220915105238498" style="zoom:50%;" />

*列索引不同*

若不做其他动作，默认生成的是并集列索引。如果设置`join="inner"`将仅生成含有共有列索引的表：

```python
df3 = pd.DataFrame(
    {
        "A": ["A8", "A9", "A10", "A11"],
        "B": ["B8", "B9", "B10", "B11"],
        "C": ["C8", "C9", "C10", "C11"],
        "D": ["D8", "D9", "D10", "D11"],
        "E": ["E1", "E2", "E3", "E4"],
    },
    index=[0, 1, 2, 3],
)

frames = [df1, df2, df3]

pd.concat(frames, ignore_index=True, join="inner")
```

<img src="../images/2022-09/image-20220915105521626.png" alt="image-20220915105521626" style="zoom:50%;" />

*横向连接*

如果我们获得了两张从不同角度对数据进行描述的表，他们的行索引相同，列索引不同。我们可以更改`axis`参数来实现不同方向的合并

```python
df1 = pd.DataFrame(
    {
        "A": ["A0", "A1", "A2", "A3"],
        "B": ["B0", "B1", "B2", "B3"],
        "C": ["C0", "C1", "C2", "C3"],
        "D": ["D0", "D1", "D2", "D3"],
    },
    index=[0, 1, 2, 3],
)

df2 = pd.DataFrame(
    {
        "E": ["E1", "E2", "E3", "E4"],
        "F":["F1", "F2", "F3", "F4"],
    },
    index=[0, 1, 2, 3],
)

frames = [df1, df2]
pd.concat(frames, axis=1, join="outer")
```

<img src="../images/2022-09/image-20220915110014369.png" alt="image-20220915110014369" style="zoom:50%;" />

*标注合并源*

我们可以添加一重索引，以标识这些数据最先来自于何处

```python
df1 = pd.DataFrame(
    {
        "A": ["A0", "A1", "A2", "A3"],
        "B": ["B0", "B1", "B2", "B3"],
        "C": ["C0", "C1", "C2", "C3"],
        "D": ["D0", "D1", "D2", "D3"],
    },
    index=[0, 1, 2, 3],
)


df2 = pd.DataFrame(
    {
        "A": ["A4", "A5", "A6", "A7"],
        "B": ["B4", "B5", "B6", "B7"],
        "C": ["C4", "C5", "C6", "C7"],
        "D": ["D4", "D5", "D6", "D7"],
    },
    index=[4, 5, 6, 7],
)


df3 = pd.DataFrame(
    {
        "A": ["A8", "A9", "A10", "A11"],
        "B": ["B8", "B9", "B10", "B11"],
        "C": ["C8", "C9", "C10", "C11"],
        "D": ["D8", "D9", "D10", "D11"],
    },
    index=[8, 9, 10, 11],
)

frames = [df1, df2, df3]
result = pd.concat(frames, keys=["df1", "df2", "df3"])
```

<img src="../images/2022-09/image-20220915110330922.png" alt="image-20220915110330922" style="zoom:50%;" />

在这样的输出中，可以通过`df.loc[<tag>]`定位之前合并进去的那一部分。在此官方文档在下面做了一个注解

> It is worth noting that [`concat()`](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.concat.html#pandas.concat) (and therefore `append()`) makes a full copy of the data, and that constantly reusing this function can create a significant performance hit. **If you need to use the operation over several datasets, use a list comprehension.**
>
> ```python
> frames = [ process_your_file(f) for f in files ]
> result = pd.concat(frames)
> ```
>
> When concatenating `DataFrames` with named axes, pandas will attempt to preserve these index/column names whenever possible. In the case where all inputs share a common name, this name will be assigned to the result. When the input names do not all agree, the result will be unnamed. The same is true for [`MultiIndex`](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.html#pandas.MultiIndex), but the logic is applied separately on a level-by-level basis.



**`DataFrame.join(other, on=None, how='left', lsuffix='', rsuffix='',sort=False)`**

* **`other`——`DataFrame`, `Series`, or `list` of `DataFrame`**

  需要进行合并的其他表或序列或者表的列表。

* `index`——`str`, `list` of `str`, or `array-like`, **optional**

  可选择指定的新表的行索引，但生成新表时会保留`DataFrame`原来的索引

* `how`——`{‘left’, ‘right’, ‘outer’, ‘inner’}`, **default** `left`

  * `left`——用`DataFrame`的行索引
  * `right`——用`other`的行索引
  * `inner`——用两者行索引的交集，保持前者的行索引顺序
  * `outer`——用两者行索引的并集，按照字典序排序
  * `cross`——做笛卡尔积
  
* `lsuffix`——`str`, default `‘’`

  如果左边的列索引出现在了右边的列索引中，将在左边的列索引后面添加的后缀

* `rsuffix`——`str`, default `‘’`

  如果右边的列索引出现在了左边的列索引中，将在右边的列索引后面添加的后缀

* `sort`——`bool`, default `False`

  是否对新表的行索引进行排序



**对于`DataFrame.append()`方法，[文档](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.append.html?highlight=append#pandas.DataFrame.append)中表示极不赞成使用（Deprecated）。因此在此不做详解。**

[了解更多](https://pandas.pydata.org/pandas-docs/stable/whatsnew/v1.4.0.html#whatsnew-140-deprecations-frame-series-append)







> ### `Pandas`中大于1的轴编号是指什么？
>
> 
>
> TODO

















































### 2.3 数据可视化
