---
layout: post
categories: posts
title: 【DatawhaleDA】 1 Pandas入门
subtitle: Datawhale开源学习社区数据分析项目笔记
featured-image: /images/2016-11-19/chino_2.jpg
tags: [Data Analysis]
date-string: SEPTEMBER 13, 2022

---



## Chapter 1



### 1.1 数据载入初步观察



#### 1.1.1 读取文件



* 函数`pandas.read_csv()`可以帮助我们读取`csv`文件
* 逐块读取需要指定函数中的`chunksize`参数
* 指定函数中的`names`来进行列索引的切换，指定`index_col`进行行索引列的列标注



实际情况下我们可能会遇见多种格式的数据文件。如何通过`pandas`进行读取？下面是官方文档中的一些资料：

| 命令                     | 功能                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `pandas.read_clipboard ` | Read text from clipboard and pass to `read_csv`              |
| **`pandas.read_csv`**    | **Read a comma-separated values (`csv`) file into `DataFrame`.<br />**Also supports optionally iterating or breaking of the file into chunks. |
| **`pandas.read_excel`**  | **Read an Excel file into a pandas `DataFrame`.<br />**Supports `xls`, `xlsx`, `xlsm`, `xlsb`, `odf`, `ods` and `odt` file extensions read from a local file system or URL. Supports an option to read a single sheet or a list of sheets. |
| `pandas.read_feather`    |                                                              |
| `pandas.read_fwf `       |                                                              |
| `pandas.read_gbq`        |                                                              |
| `pandas.read_hdf`        |                                                              |
| `pandas.read_html`       |                                                              |
| **`pandas.read_json`**   | **Convert a JSON string to pandas object.**                  |
| `pandas.read_orc`        |                                                              |
| `pandas.read_parquet`    |                                                              |
| `pandas.read_pickle`     |                                                              |
| `pandas.read_sas`        |                                                              |
| `pandas.read_spss`       |                                                              |
| **`pandas.read_sql`**    | **Read SQL query or database table into a `DataFrame`.**<br />This function is a convenience wrapper around `read_sql_table` and `read_sql_query` (for backward compatibility). It will delegate to the specific function depending on the provided input. A SQL query will be routed to `read_sql_query`, while a database table name will be routed to `read_sql_table`. Note that the delegated function might have more specific notes about their functionality not listed here. |
| `pandas.read_sql_query`  |                                                              |
| `pandas.read_sql_table`  |                                                              |
| `pandas.read_stata`      |                                                              |
| **`pandas.read_table`**  | **Read general delimited file into `DataFrame`.**<br />Also supports optionally iterating or breaking of the file into chunks. |
| **`pandas.read_xml`**    | **Read XML document into a `DataFrame` object.**             |





**问：如何读取`.tsv`文件？**

答：`tsv`文件与`csv`类似，其全称为制表符分隔值（Tab Separated Values）。查`pandas`文档知道函数`read_csv`中有一个参数为`sep=','`。我们只需要将它设置为`‘\t’`即可。当然对于长度超过1的字符串，函数将认为他们是正则表达式，从而以正则表达式所匹配的字符串进行分割。对于采用两种或以上分隔符的数据文件，正则表达式恰好可以大显身手：（在读入的文件中我特意将几处逗号改成了制表符，可以看见依然可以正常读入）

<img src="/images/2022-09/image-20220910224216619.png" alt="image-20220910224216619" style="zoom:30%;" />



**问：为什么要逐块读取文件？这样的优点是什么？**

答：先说官方文档里是这么讲的。官方文档里面说 “By specifying a `chunksize` to `read_csv`, the return value will be **an iterable object** of type `TextFileReader`: ”这样可以产生一个可迭代对象，可以放在`for i in <###>`里面来用，十分方便。至于这样做的另一个原因，我猜是因为可能有一些文件实在是太大了，所以我们希望将其分成若干小块来分别处理。

<img src="/images/2022-09/image-20220910230204363.png" alt="image-20220910230204363" style="zoom:50%;" />

问：除了采用将英文列名表头换成中文，还有什么办法？

答：可以写一个字典，遍历文件第一行以分隔符分开的列表，然后用键值对换就行了



#### 1.2 初步观察



* 使用`df.info()`获取数据的基本信息，如每列的数据类型，是否有空值

* 使用`df.head(num)`获取列表开始的几行

* 使用`df.tail(num)`获取列表结束的几行

* 使用`df.isnull()`检查空值，也可以采用一般的方法搜索空值的位置：

  <img src="/images/2022-09/image-20220910232805057.png" alt="image-20220910232805057" style="zoom:50%;" />



#### 1.3 保存数据



* 可以采用`df.to_csv()`函数进行数据的保存





> ## 备注
>
> 
>
> ### IO tools (text, CSV, HDF5, …)
>
> The pandas I/O API is a set of top level `reader` functions accessed like [`pandas.read_csv()`](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_csv.html#pandas.read_csv) that generally return a pandas object. The corresponding `writer` functions are object methods that are accessed like [`DataFrame.to_csv()`](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_csv.html#pandas.DataFrame.to_csv). Below is a table containing available `readers` and `writers`.
>
> | Format Type | Data Description                                             | Reader                                                       | Writer                                                       |
> | ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
> | text        | [CSV](https://en.wikipedia.org/wiki/Comma-separated_values)  | [read_csv](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-read-csv-table) | [to_csv](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-store-in-csv) |
> | text        | Fixed-Width Text File                                        | [read_fwf](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-fwf-reader) |                                                              |
> | text        | [JSON](https://www.json.org/)                                | [read_json](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-json-reader) | [to_json](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-json-writer) |
> | text        | [HTML](https://en.wikipedia.org/wiki/HTML)                   | [read_html](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-read-html) | [to_html](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-html) |
> | text        | [LaTeX](https://en.wikipedia.org/wiki/LaTeX)                 |                                                              | [Styler.to_latex](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-latex) |
> | text        | [XML](https://www.w3.org/standards/xml/core)                 | [read_xml](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-read-xml) | [to_xml](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-xml) |
> | text        | Local clipboard                                              | [read_clipboard](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-clipboard) | [to_clipboard](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-clipboard) |
> | binary      | [MS Excel](https://en.wikipedia.org/wiki/Microsoft_Excel)    | [read_excel](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-excel-reader) | [to_excel](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-excel-writer) |
> | binary      | [OpenDocument](http://opendocumentformat.org/)               | [read_excel](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-ods) |                                                              |
> | binary      | [HDF5 Format](https://support.hdfgroup.org/HDF5/whatishdf5.html) | [read_hdf](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-hdf5) | [to_hdf](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-hdf5) |
> | binary      | [Feather Format](https://github.com/wesm/feather)            | [read_feather](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-feather) | [to_feather](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-feather) |
> | binary      | [Parquet Format](https://parquet.apache.org/)                | [read_parquet](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-parquet) | [to_parquet](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-parquet) |
> | binary      | [ORC Format](https://orc.apache.org/)                        | [read_orc](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-orc) |                                                              |
> | binary      | [Stata](https://en.wikipedia.org/wiki/Stata)                 | [read_stata](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-stata-reader) | [to_stata](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-stata-writer) |
> | binary      | [SAS](https://en.wikipedia.org/wiki/SAS_(software))          | [read_sas](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-sas-reader) |                                                              |
> | binary      | [SPSS](https://en.wikipedia.org/wiki/SPSS)                   | [read_spss](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-spss-reader) |                                                              |
> | binary      | [Python Pickle Format](https://docs.python.org/3/library/pickle.html) | [read_pickle](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-pickle) | [to_pickle](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-pickle) |
> | SQL         | [SQL](https://en.wikipedia.org/wiki/SQL)                     | [read_sql](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-sql) | [to_sql](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-sql) |
> | SQL         | [Google BigQuery](https://en.wikipedia.org/wiki/BigQuery)    | [read_gbq](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-bigquery) | [to_gbq](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-bigquery) |
>
> 



### 1.2 Pandas基础



#### 1.2.1 使用Pandas加载的数据类型



* 通过`pd.DataFrame`或`pd.Series`加载数据
* 对于前者，可以使用`df.columns`查看列索引
* 通过`df["<column_name>"]`或者`df.<column_name>`访问列
* 使用`del`关键字删除不需要的列
* 使用`df.drop()`将列元素隐藏，但不将其删除，以方便我们对数据的观察
  * 值得注意的是，`df.drop`中的`inplace`参数默认为`False`，也即返回的是数据结构的复制（类比复制构造函数）若将其置为`True`，则其功能与`del`相同



**问：`pd.DataFrame`和`pd.Series`的区别是什么？**

> ### `pd.Series`
>
>  **One-dimensional `ndarray` with axis labels (including time series).**
>
>   Labels need not be unique but **must be a hashable type**. The object supports both integer- and label-based indexing and provides a host of methods for performing operations involving the index. *Statistical  methods from `ndarray` have been overridden to automatically exclude missing data (currently represented as `NaN`).*
>
>   Operations between Series (`+`, `-`, `/`, `*`, `**`) align values based on their associated index values-- they need not be the same length. **The result  index will be the sorted union of the two indexes.**
>
> <img src="/images/2022-09/image-20220913163813344.png" alt="image-20220913163813344" style="zoom:50%;" />
>
> 
>
> ### `pd.DataFrame`
>
> **Two-dimensional, size-mutable, potentially heterogeneous tabular data.**
>
> Data structure also contains labeled axes (rows and columns). Arithmetic operations align on both row and column labels. Can be thought of as a dict-like container for Series objects. The primary pandas data structure.



#### 1.2.2 数据筛选逻辑



* 我们可以在`df.DataFrame[]`的括号中写入逻辑表达式进行筛选。例如

  ```python
  df[df["Age"]<10].head(3)
  df[(df["Age"]>10) & (df["Age"]<50)]
  ```



**问：下面的`reset_index()`函数的作用是什么？**

```python
midage = midage.reset_index(drop=True)
```

列表在抽掉一些行数据以后，那些数据所在的行索引会消失。如果不做处理，后续接触到这些已不存在的行索引，会报错`KeyError`也就是找不到这些键了（因为它们被我们在上一步删掉了）:

<img src="/images/2022-09/image-20220913170303984.png" alt="image-20220913170303984" style="zoom:50%;" />

因此我们需要对表的行重新编号。这样就可以正常定位了

<img src="/images/2022-09/image-20220913170347976.png" alt="image-20220913170347976" style="zoom:33%;" />



**问：`iloc`和`loc`的异同？**

前者是label-based，也就是说你可以把label放进去让他去寻找。这个label可以是数字，也可以是字符串。而`iloc`是integer-based，也就是只能传入整数：

```python
midage.loc[[100,105,108],['Pclass','Name','Sex']] 
midage.iloc[[100,105,108],[2,3,4]]
```

当然，我们也可以写入逻辑式进行查询：

<img src="/images/2022-09/image-20220913171052225.png" alt="image-20220913171052225" style="zoom:50%;" />

也可以像通常的列表一样索引：

<img src="/images/2022-09/image-20220913171156184.png" alt="image-20220913171156184" style="zoom:50%;" />





### 1.3 探索性数据分析：排序与计算



* 通过`df.sort_values(by=None, ascending=None)`进行排序，`by`指定按照什么排序，`ascending`指定是否升序
  * 在不指定参数时默认将索引升序排序（也就是小的在上大的在下）
  * `axis=1`指定将列索引按照某规则进行排序

回想我们熟悉的`sorted`函数，里面支持我们使用`lambda`函数作为标准进行排序。我们也可以将其运用于这里，比如按照人名字母表顺序排序：

> key : callable, optional
>
> ​      If not None, apply the key function to the index values before sorting. This is similar to the `key` argument in the      
>
> `sorted` function, with the notable difference that this `key` function should be *vectorized*. It should expect an ``Index`` and return an ``Index`` of the same shape. For MultiIndex inputs, the key is applied *per level*.

```python
text.sort_values(by=['姓名'], ascending=True, key=lambda x:x.str.lower())
```

<img src="/images/2022-09/image-20220913180731669.png" alt="image-20220913180731669" style="zoom:50%;" />



* 形状相同的`DataFrame`可以直接进行基本运算
* 可以调用`df.describe()`获取各列的统计信息：例如最大最小值、平均数、分位数等
