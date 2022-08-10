---
layout: post
categories: posts
title: Simple Reinforcement Learning with Tensorflow Part 1.5: Contextual Bandits
featured-image: /images/2022-08-10/image-20220810092416819.png
tags: [Reinforcement Learning]
date-string: AUGUST 10, 2022
---



# SimpleRL: Simple Reinforcement Learning with Tensorflow Part 1.5: Contextual Bandits

source: https://medium.com/emergent-future/simple-reinforcement-learning-with-tensorflow-part-1-5-contextual-bandits-bff01d1aad9c

<img src="../images/2022-08-10/image-20220810092249860.png" alt="image-20220810092249860" style="zoom:50%;" />



<img src="../images/2022-08-10/image-20220810092416819.png" alt="image-20220810092416819" style="zoom:50%;" />



*(Note: This post is designed as an additional tutorial to act as a bridge between* [*Parts 1*](https://medium.com/@awjuliani/super-simple-reinforcement-learning-tutorial-part-1-fd544fab149) *&* [*2.*](https://medium.com/@awjuliani/super-simple-reinforcement-learning-tutorial-part-2-ded33892c724)*)*

In [Part 1](https://medium.com/@awjuliani/super-simple-reinforcement-learning-tutorial-part-1-fd544fab149) of my Simple RL series, we introduced the field of Reinforcement Learning, and I demonstrated how to build an agent which can solve the multi-armed bandit problem. In that situation, there are no environmental states, and the agent must simply learn to choose which action is best to take. Without a given state state, the best action at any moment is also the best action always. [Part 2](https://medium.com/@awjuliani/super-simple-reinforcement-learning-tutorial-part-2-ded33892c724) establishes the full Reinforcement Learning problem in which there are environmental states, new states depend on previous actions, and rewards can be delayed over time.

There is actually a set of problems in-between the stateless situation and the full RL problem. I want to provide an example of such a problem, and show how to solve it. My hope is that those entirely new to RL can benefit from being introduced to each element of the full formulation step by step. Specifically, in this post I want to show how to solve problems in which there are states, but they aren’t determined by the previous states or actions. Additionally, we won’t be considering delayed rewards. All of that comes in [Part 2.](https://medium.com/@awjuliani/super-simple-reinforcement-learning-tutorial-part-2-ded33892c724) This simplified way of posing the RL problem is referred to as the Contextual Bandit.



<img src="C:/Users/Gravitas/AppData/Roaming/Typora/typora-user-images/image-20220810092550454.png" alt="image-20220810092550454" style="zoom:50%;" />



## Contextual Bandit

In the original multi-armed bandit problem discussed in Part 1, there is only a single bandit, which can be thought of as like a slot-machine. The range of actions available to the agent consist of pulling one of multiple arms of the bandit. By doing so, a reward of +1 or -1 is received at different rates. The problem is considered solved if the agent learns to always choose the arm that most often provides a positive reward. In such a case, we can design an agent that completely ignores the state of the environment, since for all intents and purposes, there is only ever a single, unchanging state.

Contextual Bandits introduce the concept of the *state*. The state consists of a description of the environment that the agent can use to take more informed actions. In our problem, instead of a single bandit, there can now be multiple bandits. The state of the environment tells us which bandit we are dealing with, and the goal of the agent is to learn the best action not just for a single bandit, but for any number of them. Since each bandit will have different reward probabilities for each arm, our agent will need to learn to condition its action on the state of the environment. Unless it does this, it won’t achieve the maximum reward possible over time. In order to accomplish this, we will be building a single-layer neural network in Tensorflow that takes a state and produces an action. By using a policy-gradient update method, we can have the network learn to take actions that maximize its reward. Below is the iPython notebook walking through the tutorial.



> # Simple Reinforcement Learning in Tensorflow Part 1.5:
>
> ## The Contextual Bandits
>
> This tutorial contains a simple example of how to build a policy-gradient based agent that can solve the contextual bandit problem. For more information, see this [Medium post](https://medium.com/p/bff01d1aad9c).
>
> For more Reinforcement Learning algorithms, including DQN and Model-based learning in Tensorflow, see my Github repo, [DeepRL-Agents](https://github.com/awjuliani/DeepRL-Agents).
>
> In [1]:
>
> ```python
> import tensorflow as tf
> import tensorflow.contrib.slim as slim
> import numpy as np
> ```
>
> ### The Contextual Bandits
>
> Here we define our contextual bandits. In this example, we are using three four-armed bandit. What this means is that each bandit has four arms that can be pulled. Each bandit has different success probabilities for each arm, and as such requires different actions to obtain the best result. The pullBandit function generates a random number from a normal distribution with a mean of 0. The lower the bandit number, the more likely a positive reward will be returned. We want our agent to learn to always choose the bandit-arm that will most often give a positive reward, depending on the Bandit presented.
>
> In [6]:
>
> ```python
> class contextual_bandit():
>     def __init__(self):
>         self.state = 0
>         #List out our bandits. Currently arms 4, 2, and 1 (respectively) are the most optimal.
>         self.bandits = np.array([[0.2,0,-0.0,-5],[0.1,-5,1,0.25],[-5,5,5,5]])
>         self.num_bandits = self.bandits.shape[0]
>         self.num_actions = self.bandits.shape[1]
>         
>     def getBandit(self):
>         self.state = np.random.randint(0,len(self.bandits)) #Returns a random state for each episode.
>         return self.state
>         
>     def pullArm(self,action):
>         #Get a random number.
>         bandit = self.bandits[self.state,action]
>         result = np.random.randn(1)
>         if result > bandit:
>             #return a positive reward.
>             return 1
>         else:
>             #return a negative reward.
>             return -1
> ```
>
> ### The Policy-Based Agent
>
> The code below established our simple neural agent. It takes as input the current state, and returns an action. This allows the agent to take actions which are conditioned on the state of the environment, a critical step toward being able to solve full RL problems. The agent uses a single set of weights, within which each value is an estimate of the value of the return from choosing a particular arm given a bandit. We use a policy gradient method to update the agent by moving the value for the selected action toward the recieved reward.
>
> In [7]:
>
> ```python
> class agent():
>     def __init__(self, lr, s_size,a_size):
>         #These lines established the feed-forward part of the network. The agent takes a state and produces an action.
>         self.state_in= tf.placeholder(shape=[1],dtype=tf.int32)
>         state_in_OH = slim.one_hot_encoding(self.state_in,s_size)
>         output = slim.fully_connected(state_in_OH,a_size,\
>             biases_initializer=None,activation_fn=tf.nn.sigmoid,weights_initializer=tf.ones_initializer())
>         self.output = tf.reshape(output,[-1])
>         self.chosen_action = tf.argmax(self.output,0)
> 
>         #The next six lines establish the training proceedure. We feed the reward and chosen action into the network
>         #to compute the loss, and use it to update the network.
>         self.reward_holder = tf.placeholder(shape=[1],dtype=tf.float32)
>         self.action_holder = tf.placeholder(shape=[1],dtype=tf.int32)
>         self.responsible_weight = tf.slice(self.output,self.action_holder,[1])
>         self.loss = -(tf.log(self.responsible_weight)*self.reward_holder)
>         optimizer = tf.train.GradientDescentOptimizer(learning_rate=lr)
>         self.update = optimizer.minimize(self.loss)
> ```
>
> ### Training the Agent
>
> We will train our agent by getting a state from the environment, take an action, and recieve a reward. Using these three things, we can know how to properly update our network in order to more often choose actions given states that will yield the highest rewards over time.
>
> In [8]:
>
> ```python
> tf.reset_default_graph() #Clear the Tensorflow graph.
> 
> cBandit = contextual_bandit() #Load the bandits.
> myAgent = agent(lr=0.001,s_size=cBandit.num_bandits,a_size=cBandit.num_actions) #Load the agent.
> weights = tf.trainable_variables()[0] #The weights we will evaluate to look into the network.
> 
> total_episodes = 10000 #Set total number of episodes to train agent on.
> total_reward = np.zeros([cBandit.num_bandits,cBandit.num_actions]) #Set scoreboard for bandits to 0.
> e = 0.1 #Set the chance of taking a random action.
> 
> init = tf.initialize_all_variables()
> 
> # Launch the tensorflow graph
> with tf.Session() as sess:
>     sess.run(init)
>     i = 0
>     while i < total_episodes:
>         s = cBandit.getBandit() #Get a state from the environment.
>         
>         #Choose either a random action or one from our network.
>         if np.random.rand(1) < e:
>             action = np.random.randint(cBandit.num_actions)
>         else:
>             action = sess.run(myAgent.chosen_action,feed_dict={myAgent.state_in:[s]})
>         
>         reward = cBandit.pullArm(action) #Get our reward for taking an action given a bandit.
>         
>         #Update the network.
>         feed_dict={myAgent.reward_holder:[reward],myAgent.action_holder:[action],myAgent.state_in:[s]}
>         _,ww = sess.run([myAgent.update,weights], feed_dict=feed_dict)
>         
>         #Update our running tally of scores.
>         total_reward[s,action] += reward
>         if i % 500 == 0:
>             print "Mean reward for each of the " + str(cBandit.num_bandits) + " bandits: " + str(np.mean(total_reward,axis=1))
>         i+=1
> for a in range(cBandit.num_bandits):
>     print "The agent thinks action " + str(np.argmax(ww[a])+1) + " for bandit " + str(a+1) + " is the most promising...."
>     if np.argmax(ww[a]) == np.argmin(cBandit.bandits[a]):
>         print "...and it was right!"
>     else:
>         print "...and it was wrong!"
> ```




Hopefully you’ve found this tutorial helpful in giving an intuition of how reinforcement learning agents can learn to solve problems of varying complexity and interactivity. If you’ve mastered this problem, you are ready to explore the full problem where time and actions matter in Part 2 and beyond of this series.

If this post has been valuable to you, please consider [*donating*](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=V2R22DV4XSR5Y&lc=US&item_name=Arthur Juliani's Deep Learning Tutorials&currency_code=USD&bn=PP-DonationsBF%3abtn_donateCC_LG.gif%3aNonHosted) to help support future tutorials, articles, and implementations. Any contribution is greatly appreciated!

**More from my Simple Reinforcement Learning with Tensorflow series:**

1. [*Part 0 — Q-Learning Agents*](https://medium.com/@awjuliani/simple-reinforcement-learning-with-tensorflow-part-0-q-learning-with-tables-and-neural-networks-d195264329d0)
2. [*Part 1 — Two-Armed Bandit*](https://medium.com/@awjuliani/super-simple-reinforcement-learning-tutorial-part-1-fd544fab149)
3. **Part 1.5 — Contextual Bandits**
4. [*Part 2 — Policy-Based Agents*](https://medium.com/@awjuliani/super-simple-reinforcement-learning-tutorial-part-2-ded33892c724)
5. [*Part 3 — Model-Based RL*](https://medium.com/@awjuliani/simple-reinforcement-learning-with-tensorflow-part-3-model-based-rl-9a6fe0cce99)
6. [*Part 4 — Deep Q-Networks and Beyond*](https://medium.com/@awjuliani/simple-reinforcement-learning-with-tensorflow-part-4-deep-q-networks-and-beyond-8438a3e2b8df#.i2zpbmre8)
7. [*Part 5 — Visualizing an Agent’s Thoughts and Actions*](https://medium.com/@awjuliani/simple-reinforcement-learning-with-tensorflow-part-5-visualizing-an-agents-thoughts-and-actions-4f27b134bb2a)
8. [*Part 6 — Partial Observability and Deep Recurrent Q-Networks*](https://medium.com/@awjuliani/simple-reinforcement-learning-with-tensorflow-part-6-partial-observability-and-deep-recurrent-q-68463e9aeefc#.gi4xdq8pk)
9. [*Part 7 — Action-Selection Strategies for Exploration*](https://medium.com/@awjuliani/simple-reinforcement-learning-with-tensorflow-part-7-action-selection-strategies-for-exploration-d3a97b7cceaf)
10. [*Part 8 — Asynchronous Actor-Critic Agents (A3C)*](https://medium.com/@awjuliani/simple-reinforcement-learning-with-tensorflow-part-8-asynchronous-actor-critic-agents-a3c-c88f72a5e9f2#.hg13tn9zw)

If you’d like to follow my work on Deep Learning, AI, and Cognitive Science, follow me on Medium @

[Arthur Juliani](https://medium.com/u/18dfe63fa7f0?source=post_page-----bff01d1aad9c--------------------------------)

, or on twitter [@awjliani](https://twitter.com/awjuliani).