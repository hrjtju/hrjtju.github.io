---
layout: post
categories: posts
title: 【DatawhalePT】 Pytorch Basics
subtitle: Datawhale开源学习社区深入浅出Pytorch项目笔记
featured-image: /images/2016-11-19/bg.png
tags: [Pytorch]
date-string: NOVEMBER 15, 2022

---



## 2 Pytorch Basics

### 2.1 Tensor


```python
import torch
# randomly initialized tensor
x = torch.rand(4, 3)
print("x = ", x)

# zero tensor
z = torch.zeros(4, 3, dtype=torch.long)
print("z = ", z)

# initialized from a list
t_l = torch.tensor([1, 2, 3])
print("t_l = ", t_l)

# keep the new tensor's shape like a previous tensor
ts = torch.rand_like(x, dtype=torch.float)
print("ts = ", ts)
```

    x =  tensor([[0.0036, 0.7979, 0.3057],
            [0.3449, 0.9087, 0.3161],
            [0.4880, 0.1389, 0.5088],
            [0.1169, 0.0882, 0.2219]])
    z =  tensor([[0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]])
    t_l =  tensor([1, 2, 3])
    ts =  tensor([[0.0823, 0.5508, 0.9419],
            [0.7218, 0.2149, 0.4641],
            [0.9534, 0.4842, 0.8112],
            [0.6577, 0.3524, 0.2608]])



```python
# get the dumensions
print(x.size(), x.shape)

# performing tuple operations on torch.size()
print(x.shape[0], x.shape[1])
```

    torch.Size([4, 3]) torch.Size([4, 3])
    4 3


### 2.2 Performing Matrix Operations and Slicing


```python
x = torch.ones(3, 4)
y = torch.randn(3, 4)
print("x = ", x, "\ny = ", y)

# matrix addition
print("x + y = ", x + y)                            # adding using operator
print("torch.add(x, y) = ", torch.add(x, y))        # adding using adding function
print("y.add_(x) = ", y.add_(x))                    # inplace adding: y = y + x

```

    x =  tensor([[1., 1., 1., 1.],
            [1., 1., 1., 1.],
            [1., 1., 1., 1.]]) 
    y =  tensor([[ 6.9944e-01, -1.2101e+00,  1.6610e+00, -1.0896e+00],
            [ 1.9741e-01,  5.3173e-01, -1.2845e+00, -1.8685e+00],
            [ 2.1947e+00,  2.7464e-01, -3.1271e-01,  1.5261e-03]])
    x + y =  tensor([[ 1.6994, -0.2101,  2.6610, -0.0896],
            [ 1.1974,  1.5317, -0.2845, -0.8685],
            [ 3.1947,  1.2746,  0.6873,  1.0015]])
    torch.add(x, y) =  tensor([[ 1.6994, -0.2101,  2.6610, -0.0896],
            [ 1.1974,  1.5317, -0.2845, -0.8685],
            [ 3.1947,  1.2746,  0.6873,  1.0015]])
    y.add_(x) =  tensor([[ 1.6994, -0.2101,  2.6610, -0.0896],
            [ 1.1974,  1.5317, -0.2845, -0.8685],
            [ 3.1947,  1.2746,  0.6873,  1.0015]])



```python
# y refers to the same area of memory of x[0, :] if assigned without using the methos clone()
print("Without using clone()")
y = x[0, :]
print("before inplace addition: \ny = ", y)
y += 1
print("after inplace addition: \ny = ", y, "\tx[0, :] = ", x[0, :])

# x[0, :] stays the same if using clone()
print("\nUsing clone()")
y = x.clone()[0, :]
print("before inplace addition: \ny = ", y)
y += 1
print("after inplace addition: \ny = ", y, "\tx[0, :] = ", x[0, :])
```

    Without using clone()
    before inplace addition: 
    y =  tensor([18., 18., 18., 18.])
    after inplace addition: 
    y =  tensor([19., 19., 19., 19.]) 	x[0, :] =  tensor([19., 19., 19., 19.])
    
    Using clone()
    before inplace addition: 
    y =  tensor([19., 19., 19., 19.])
    after inplace addition: 
    y =  tensor([20., 20., 20., 20.]) 	x[0, :] =  tensor([19., 19., 19., 19.])


### 2.3 Reshaping


```python
x = torch.arange(0, 100, 5)
print("x = ", x)
x = x.reshape(2, -1)
print("x.reshape(2, -1)", x)
print("x.view(x.T.shape)", x.view(x.T.shape))
# torch.view() only changes the observation perspective of the tensor, which means it doesnot yield a copy of the tensor
```

    x =  tensor([ 0,  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85,
            90, 95])
    x.reshape(2, -1) tensor([[ 0,  5, 10, 15, 20, 25, 30, 35, 40, 45],
            [50, 55, 60, 65, 70, 75, 80, 85, 90, 95]])
    x.view(x.T.shape) tensor([[ 0,  5],
            [10, 15],
            [20, 25],
            [30, 35],
            [40, 45],
            [50, 55],
            [60, 65],
            [70, 75],
            [80, 85],
            [90, 95]])


### 2.4 Fetching Value of Tensor


```python
# for one item tensor, we can use .item() method to get the value

x = torch.randn(1)
print(x, x.item())
```

    tensor([0.5227]) 0.5227316617965698


### 2.5 Broadcasting


```python
x = torch.Tensor([1, 2])
y = torch.Tensor([[1], [2], [3]])
print(f"x = {x}\ny = {y}\nx + y = {x + y}")
```

    x = tensor([1., 2.])
    y = tensor([[1.],
            [2.],
            [3.]])
    x + y = tensor([[2., 3.],
            [3., 4.],
            [4., 5.]])


### 2.6 Audograd


```python
from __future__ import print_function

x = torch.ones(3, 3, requires_grad=True)        # requires_grad is False by default
print(x.grad_fn)                                # None.

print("x = ", x)
y = x ** 2
print("y = ", y)
z = y * y * 3
print("z = ", z)
w= z.mean()
print("w = ", w)
```

    None
    x =  tensor([[1., 1., 1.],
            [1., 1., 1.],
            [1., 1., 1.]], requires_grad=True)
    y =  tensor([[1., 1., 1.],
            [1., 1., 1.],
            [1., 1., 1.]], grad_fn=<PowBackward0>)
    z =  tensor([[3., 3., 3.],
            [3., 3., 3.],
            [3., 3., 3.]], grad_fn=<MulBackward0>)
    w =  tensor(3., grad_fn=<MeanBackward0>)



```python
# gradient accumulates if not set to zero before next backward()
out = z.sum()
out.backward(retain_graph=True)
print(x.grad, end = "\n\n")

out1 = z.sum()
x.grad.data.zero_()
out1.backward(retain_graph=True)
print(x.grad)
```

    tensor([[24., 24., 24.],
            [24., 24., 24.],
            [24., 24., 24.]])
    
    tensor([[12., 12., 12.],
            [12., 12., 12.],
            [12., 12., 12.]])



```python
x = torch.randn(3, requires_grad=True)
print(x)

y = x * 2
i = 0

while y.data.norm() < 1000:
    y = y * 2
    i += 1

print(y)
y.backward(torch.tensor([0.1, 1.0, 0.0001]))
print(x.grad)
```

    tensor([-1.0359,  0.5815, -0.2381], requires_grad=True)
    tensor([-1060.7622,   595.4866,  -243.8183], grad_fn=<MulBackward0>)
    tensor([1.0240e+02, 1.0240e+03, 1.0240e-01])



```python
# we cam stop autograd by assigning "with torch.no_grad()"

with torch.no_grad():
    print(x.requires_grad, (x ** 2).requires_grad)
```

    True False



```python
# if we want to change the value of a tensor while donot affet the computation graph, consider data()

x = torch.ones(1, requires_grad=True)
t = x * 3
x.data *= 100

t.backward()
print(x, x.grad)
```

    tensor([100.], requires_grad=True) tensor([3.])



```python

```

    tensor([100.], requires_grad=True) tensor([600.])
