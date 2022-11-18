---
layout: post
categories: posts
title: 【DatawhalePT】 Introduction to Basic Pytorch Modules
subtitle: Datawhale开源学习社区深入浅出Pytorch项目笔记
featured-image: /images/2016-11-19/bg.png
tags: [Pytorch]
date-string: NOVEMBER 18, 2022
---



## 3 Pytorch的主要组成模块

### 3.1 完成深度学习的必要部分

**完成机器学习任务的步骤**

* 数据预处理
* 划分训练集测试集
* 选择模型，定义损失函数和优化方法
* 确定超参数
* 使用模型拟合训练数据
* 在测试机或验证集中测试模型

**深度学习与机器学习的不同之处**

* 数据量大，无法一次性全部读取 -> 小批量学习(mini-batch)
* DNN层数较多，往往使用一些已经搭建好的模块逐层搭建网络
* 损失函数和优化器能保证反向传播(back propogation)能在用户自定义的模型结构上实现
* 涉及GPU操作
* 涉及到各个模块间的配合

### 3.2 基本配置


```python
import os
import numpy as np 
import torch 
import torch.nn as nn 
from torch.utils.data import Dataset, DataLoader
import torch.optim as optim
import pandas as pd
```

**设置超参数**

* `batch_size`
* `lr`
* `max_epochs`
* `device`


```python
BATCH_SIZE = 16
LR = 1e-4
MAX_EPOCHS = 100
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"DEVICE = {DEVICE}")
```

    DEVICE = cuda


### 3.3 数据读入

定义`Dataset`类：

* `__init__`——用于传入外部参数，同时定义样本集
* `__getitem__`——用于逐个提取样本中的元素，可以进行一定的变换，并返回相应的数据
* `__len__`——返回训练数据集的样本数


```python

```


```python
class MyDataset(Dataset):
    def __init__(self, data_dir, info_csv, image_list, transform=None):
        """User defined dataset

        Args:
            data_dir (`str`): _description_
            info_csv (`str`): _description_
            image_list (`str`): _description_
            transform (`torchvision.transforms.transforms.Compose`, optional):_description_. Defaults to None.
        """
        
        label_info = pd.read_csv
        image_file = open(image_list).readlines()
        self.data_dir = data_dir
        self.image_file = image_file
        self.label_info = label_info
        self.transform = transform
        
    def __getitem__(self, index):
        """get item

        Args:
            index (`int`): the index of an item
        """
        
        image_name = self.image_file[index].strip('\n')
        raw_label = self.label_info.loc[self.label_info["Image_index"] == image_name]
        label = raw_label.iloc[:, 0]
        image_name = os.path.join(self.data_dir, image_name)
        image = Image.open(image_name).convert("RGB")
        
        assert self.transform is not None
        
        image = self.transform(image)
        return image, label
    
    def __len__(self):
        return len(self.image_file)
```

### 3.4 模型构建


```python
class MLP(nn.Module):
    def __init__(self, **kwargs):
        super(MLP, self).__init__(**kwargs)
        
        self.hid = nn.Linear(784, 256)
        self.act = nn.LeakyReLU()
        self.out = nn.Linear(256, 10)
    
    def forward(self, x):
        out_ = self.act(self.hid(x))
        return self.out(out_)
```


```python
X = torch.rand(2, 784)
net = MLP()
print(net)
net(X)
```

    MLP(
      (hid): Linear(in_features=784, out_features=256, bias=True)
      (act): LeakyReLU(negative_slope=0.01)
      (out): Linear(in_features=256, out_features=10, bias=True)
    )





    tensor([[-0.1397, -0.0123,  0.0483, -0.0298, -0.0457, -0.1524, -0.0193,  0.1725,
              0.0330,  0.1409],
            [-0.0738,  0.0323,  0.0735, -0.0088, -0.1536,  0.0659, -0.0745,  0.2389,
              0.1194,  0.1117]], grad_fn=<AddmmBackward0>)



**平凡的神经网络层**


```python
# 不含模型参数
class MyLayer(nn.Module):
    def __init__(self, **kwargs):
        super(MyLayer, self).__init__(**kwargs)
    def forward(self, x):
        return x - x.mean()
```


```python
layer = MyLayer()
layer(torch.tensor([1, 2, 3, 4, 5], dtype=torch.float))
```




    tensor([-2., -1.,  0.,  1.,  2.])



**含有可训练参数的神经网络层**


```python
# 含有模型参数
class MyListDense(nn.Module):
    def __init__(self, **kwargs):
        super(MyListDense, self).__init__(**kwargs)
        self.params = nn.ParameterList([
            nn.Parameter(torch.randn(4, 4)) for i in range(3)
        ])
        self.params.append(nn.Parameter(torch.randn(4, 1)))
    def forward(self, x):
        for i, item in enumerate(self.params):
            # perform matrix multiplication
            x = torch.mm(x, item)
        return x 
```


```python
class MyDictDense(nn.Module):
    def __init__(self, **kwargs):
        super(MyDictDense, self).__init__(**kwargs)
        self.params = nn.ParameterDict({
            "liner1": nn.Parameter(torch.randn(4, 4))
            , "linear2": nn.Parameters(torch.randn(4, 1))
        })
        # append a set of param into self.params
        self.param.update({"linear3": nn.Parameter(torch.randn(4, 2))})
    def forward(self, x, choice: str = None):
        assert choice is not None and choice in self.params.keys()
        return torch.mm(x, self.params[choice])
```

**二维卷积**


```python
# correlation 2D
def Corr2D(X, K):
    h, w = K.shape
    X, K = X.float(), K.float()
    Y = torch.zeros((X.shape[0] - h + 1, X.shape[1] - h + 1))
    
    for i in range(Y.shape[0]):
        for j in range(Y.shape[1]):
            Y[i, j] = (X[i:i+h, j:j+w] * K).sum()
    return Y

class Conv2D_(nn.Module):
    def __init__(self, kernel_size):
        super(Conv2D_, self).__init__()
        self.weight = nn.Parameter(torch.randn(kernel_size))
        self.bias = nn.Parameter(torch.randn(1))
    def forward(self, x):
        return Corr2D(x, self.weight) + self.bias
```


```python
def comp_conv2d(conv2d, X):
    X = X.view((1, 1) + X.shape)
    Y = conv2d(X)
    
    return Y.view(Y.shape[2:])

conv2d = nn.Conv2d(in_channels=1
                   , out_channels=1
                   , kernel_size=3
                   , padding=1)
X = torch.rand(8, 8)
comp_conv2d(conv2d, X)
```




    tensor([[ 0.2561,  0.1170,  0.1196,  0.2349, -0.0497,  0.0768,  0.1835,  0.1569],
            [ 0.0324, -0.0906,  0.1453, -0.3537, -0.3329, -0.1033, -0.1712,  0.0681],
            [-0.4505, -0.0742, -0.1641, -0.1508,  0.2548, -0.0884, -0.3132, -0.1936],
            [ 0.1983,  0.0585, -0.3002,  0.0610, -0.0968, -0.3376, -0.3035, -0.0877],
            [-0.2974, -0.0711, -0.0147,  0.0923, -0.2067, -0.1898, -0.1688, -0.1311],
            [-0.0734, -0.3866,  0.0043,  0.0106, -0.1539, -0.1550,  0.0852,  0.1506],
            [ 0.1275, -0.0906, -0.1280, -0.5574, -0.2015, -0.0560, -0.2895, -0.1012],
            [-0.2457, -0.2900, -0.3881, -0.4805, -0.3086, -0.4363, -0.3830, -0.0838]],
           grad_fn=<ViewBackward0>)




```python
(1, 1) + (2, 3)
```




    (1, 1, 2, 3)



**池化层(Pooling)**


```python
def pool2d(X, pool_size, mode="max"):
    p_h, p_w = pool_size
    Y = torch.zeros((X.shape[0] - p_h + 1, X.shape[1] - p_w + 1))
    for i in range(Y.shape[0]):
        for j in range(Y.shape[1]):
            if mode == "max":
                Y[i, j] = X[i:i+p_h, j:j+p_w].max()
            elif mode == "avg" or mode == "mean":
                Y[i, j] = X[i:i+p_h, j:j+p_w].mean()
            else:
                raise KeyError(f"Invalid Mode: {mode}")
    return Y
```


```python
X = torch.tensor([[0, 1, 2], [3, 4, 5], [6, 7, 8]], dtype=torch.float)
pool2d(X, (2, 2))
```




    tensor([[4., 5.],
            [7., 8.]])



**模型实例**


```python
import torch.nn.functional as F
class LeNet(nn.Module):
    def __init__(self):
        super(LeNet, self).__init__()
        # conv layers
        self.conv1 = nn.Conv2d(1, 6, 5)
        self.conv2 = nn.Conv2d(6, 16, 5)
        # dense layers
        self.fc = nn.Sequential(nn.Linear(16 * 5 * 5, 120)
                                , nn.ReLU()
                                , nn.Linear(120, 84)
                                , nn.ReLU()
                                , nn.Linear(84, 10))
    
    def num_flat_features(self, x):
        size_ = x.size()[1:]
        num_featurres = 1
        for s in size_:
            num_features += s
        return num_features
        
    
    def forward(self, x):
        x = F.max_pool2d(F.relu(self.conv1(x)), (2, 2))
        x = F.max_pool2d(F.relu(self.conv2(x)), 2)
        x = x.view(-1, self.num_flat_features(x))
        x = F.relu(self.fc(x))
        return x

net = LeNet()
print(net)
```

    LeNet(
      (conv1): Conv2d(1, 6, kernel_size=(5, 5), stride=(1, 1))
      (conv2): Conv2d(6, 16, kernel_size=(5, 5), stride=(1, 1))
      (fc): Sequential(
        (0): Linear(in_features=400, out_features=120, bias=True)
        (1): ReLU()
        (2): Linear(in_features=120, out_features=84, bias=True)
        (3): ReLU()
        (4): Linear(in_features=84, out_features=10, bias=True)
      )
    )


### 3.5 模型初始化

* `torch.nn.init.kaiming_normal_` 凯明初始化
* `torch.nn.init.constant_` 常数初始化
* `torch.nn.init.zeros_` 零初始化
* [more](https://pytorch.org/docs/stable/nn.init.html)

### 3.6 损失函数

* `torch.nn.BCELoss(weight=None, size_average=None, reduce=None, reduction='mean')`
* `torch.nn.CrossEntropyLoss(weight=None, size_average=None, ignore_index=-100, reduce=None, reduction='mean')`
* `torch.nn.L1Loss(size_average=None, reduce=None, reduction='mean')`
* `torch.nn.MSELoss(size_average=None, reduce=None, reduction='mean')`
* `torch.nn.SmoothL1Loss(size_average=None, reduce=None, reduction='mean', beta=1.0)`
* `torch.nn.PoissonNLLLoss(log_input=True, full=False, size_average=None, eps=1e-08, reduce=None, reduction='mean')`
* `torch.nn.KLDivLoss(size_average=None, reduce=None, reduction='mean', log_target=False)`
* `torch.nn.MarginRankingLoss(margin=0.0, size_average=None, reduce=None, reduction='mean')`
* `torch.nn.MultiLabelMarginLoss(size_average=None, reduce=None, reduction='mean')`
* `torch.nn.SoftMarginLoss(size_average=None, reduce=None, reduction='mean')torch.nn.(size_average=None, reduce=None, reduction='mean')`
* `torch.nn.MultiMarginLoss(p=1, margin=1.0, weight=None, size_average=None, reduce=None, reduction='mean')`
* `torch.nn.TripletMarginLoss(margin=1.0, p=2.0, eps=1e-06, swap=False, size_average=None, reduce=None, reduction='mean')`
* `torch.nn.HingeEmbeddingLoss(margin=1.0, size_average=None, reduce=None, reduction='mean')`
* `torch.nn.CosineEmbeddingLoss(margin=0.0, size_average=None, reduce=None, reduction='mean')`
* `torch.nn.CTCLoss(blank=0, reduction='mean', zero_infinity=False)`

### 3.7 优化器

```python
class Optimizer(object):
    def __init__(self, params, defaults):        
        self.defaults = defaults
        self.state = defaultdict(dict)
        self.param_groups = []
```

## 4 MASHION_MNIST实战


```python
import os
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
```


```python
DEVICE = DEVICE
BATCH_SIZE = 256
NUM_WORKERS = 4
LR = 1e-4
MAX_EPOCHS = 20
```


```python
## 读取方式一：使用torchvision自带数据集，下载可能需要一段时间
from torchvision import datasets
from torchvision import transforms

image_size = 28
data_transform = transforms.Compose([
    transforms.Resize(image_size),
    transforms.ToTensor()
])

train_data = datasets.FashionMNIST(root='./', train=True, download=True, transform=data_transform)
test_data = datasets.FashionMNIST(root='./', train=False, download=True, transform=data_transform)
```


```python
import matplotlib.pyplot as plt

train_loader = DataLoader(train_data, batch_size=BATCH_SIZE, shuffle=True, num_workers=NUM_WORKERS, drop_last=True)
test_loader = DataLoader(test_data, batch_size=BATCH_SIZE, shuffle=False, num_workers=NUM_WORKERS)

image, label = next(iter(train_loader))
print(image.shape, label.shape)
plt.imshow(image[0][0], cmap="gray")
```

    torch.Size([256, 1, 28, 28]) torch.Size([256])

    <matplotlib.image.AxesImage at 0x1eb53d876d0>


![png](/images/2022-11/output_33_2.png)
   

```python
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(1, 32, 5),
            nn.ReLU(),
            nn.MaxPool2d(2, stride=2),
            nn.Dropout(0.3),
            nn.Conv2d(32, 64, 5),
            nn.ReLU(),
            nn.MaxPool2d(2, stride=2),
            nn.Dropout(0.3)
        )
        self.fc = nn.Sequential(
            nn.Linear(64*4*4, 512),
            nn.ReLU(),
            nn.Linear(512, 10)
        )
        
    def forward(self, x):
        x = self.conv(x)
        x = x.view(-1, 64*4*4)
        x = self.fc(x)
        # x = nn.functional.normalize(x)
        return x

model = Net()
model = model.cuda()
```


```python
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)
```


```python
def train(epoch):
    model.train()
    train_loss = 0
    for data, label in train_loader:
        data, label = data.cuda(), label.cuda()
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, label)
        loss.backward()
        optimizer.step()
        train_loss += loss.item()*data.size(0)
    train_loss = train_loss/len(train_loader.dataset)
    print('Epoch: {} \tTraining Loss: {:.6f}'.format(epoch, train_loss))
```


```python
def val(epoch):       
    model.eval()
    val_loss = 0
    gt_labels = []
    pred_labels = []
    with torch.no_grad():
        for data, label in test_loader:
            data, label = data.cuda(), label.cuda()
            output = model(data)
            preds = torch.argmax(output, 1)
            gt_labels.append(label.cpu().data.numpy())
            pred_labels.append(preds.cpu().data.numpy())
            loss = criterion(output, label)
            val_loss += loss.item()*data.size(0)
    val_loss = val_loss/len(test_loader.dataset)
    gt_labels, pred_labels = np.concatenate(gt_labels), np.concatenate(pred_labels)
    acc = np.sum(gt_labels==pred_labels)/len(pred_labels)
    print('Epoch: {} \tValidation Loss: {:.6f}, Accuracy: {:6f}'.format(epoch, val_loss, acc))
```


```python
for epoch in range(1, MAX_EPOCHS+1):
    train(epoch)
    val(epoch)
```

    Epoch: 1 	Training Loss: 0.685476
    Epoch: 1 	Validation Loss: 0.466092, Accuracy: 0.829600
    Epoch: 2 	Training Loss: 0.437943
    Epoch: 2 	Validation Loss: 0.381142, Accuracy: 0.862900
    Epoch: 3 	Training Loss: 0.376280
    Epoch: 3 	Validation Loss: 0.340400, Accuracy: 0.878100
    Epoch: 4 	Training Loss: 0.339049
    Epoch: 4 	Validation Loss: 0.320119, Accuracy: 0.885600
    Epoch: 5 	Training Loss: 0.313327
    Epoch: 5 	Validation Loss: 0.306811, Accuracy: 0.890500
    Epoch: 6 	Training Loss: 0.297129
    Epoch: 6 	Validation Loss: 0.285448, Accuracy: 0.895800
    Epoch: 7 	Training Loss: 0.282314
    Epoch: 7 	Validation Loss: 0.275616, Accuracy: 0.901800
    Epoch: 8 	Training Loss: 0.267672
    Epoch: 8 	Validation Loss: 0.275982, Accuracy: 0.897200
    Epoch: 9 	Training Loss: 0.257960
    Epoch: 9 	Validation Loss: 0.269199, Accuracy: 0.899600
    Epoch: 10 	Training Loss: 0.250030
    Epoch: 10 	Validation Loss: 0.251993, Accuracy: 0.909900
    Epoch: 11 	Training Loss: 0.239419
    Epoch: 11 	Validation Loss: 0.246614, Accuracy: 0.910900
    Epoch: 12 	Training Loss: 0.231031
    Epoch: 12 	Validation Loss: 0.247359, Accuracy: 0.909000
    Epoch: 13 	Training Loss: 0.222482
    Epoch: 13 	Validation Loss: 0.243644, Accuracy: 0.910600
    Epoch: 14 	Training Loss: 0.214492
    Epoch: 14 	Validation Loss: 0.235273, Accuracy: 0.913000
    Epoch: 15 	Training Loss: 0.209263
    Epoch: 15 	Validation Loss: 0.232547, Accuracy: 0.915400
    Epoch: 16 	Training Loss: 0.204131
    Epoch: 16 	Validation Loss: 0.232693, Accuracy: 0.917900
    Epoch: 17 	Training Loss: 0.193449
    Epoch: 17 	Validation Loss: 0.233743, Accuracy: 0.916000
    Epoch: 18 	Training Loss: 0.189666
    Epoch: 18 	Validation Loss: 0.225776, Accuracy: 0.916200
    Epoch: 19 	Training Loss: 0.184931
    Epoch: 19 	Validation Loss: 0.228492, Accuracy: 0.919100
    Epoch: 20 	Training Loss: 0.179981
    Epoch: 20 	Validation Loss: 0.230845, Accuracy: 0.914800


