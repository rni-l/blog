### 冒泡排序

两两交换，每次“内循环”完成后，最后一位肯定是最大（小）的

```c
#include <stdio.h>

int main()
{
    int arr[16] = {1,2,34,2,1,3,23,1,2,34,6,63,4634,34,53,5};
    int i = 0;
    int j = 0;
    int len = 16;
    int tmp;
    int isMatch = 0;
    for (i = 0; i < len; i++) {
        j = 0;
        isMatch = 0;
        while (j < (len - i - 1)) {
            if (arr[j] > arr[j + 1]) {
                tmp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tmp;
                isMatch = 1;
            }
            j++;
        }
        if (isMatch == 0) {
            break;
        }
    }
    i = 0;
    while(i < len) {
        printf("%d ", arr[i]);
        i++;
    }
}

```



### 插入排序

双循环，内循环从 i - 1 开始，当 arr[j] 的值大（小）于目标值（arr[i]），停止内循环，并进行替换。内循环过程中，将循环的值往前一个个移动

```c
int main()
{
    int len = 16;
    int arr[16] = {1,2,34,2,1,3,23,1,2,34,6,63,4634,34,53,5};
    int i = 1;
    int j = 0;
    int tmp;
    for (i = 1; i < len; i++) {
        if (arr[i] < arr[i - 1]) {
            tmp = arr[i];
            for (j = i - 1; arr[j] >= tmp; j--) {
                arr[j + 1] = arr[j];
            }
            arr[j + 1] = tmp;
        }
    }
    i = 0;
    while(i < len) {
        printf("%d ", arr[i]);
        i++;
    }
}
```



### 简单选择排序

双循环，每次从 i + 1 出发，将最大（小）值移动到 i 的位置；这样使交换次数减少

```c
#include <stdio.h>

int main()
{
    int len = 16;
    int arr[16] = {1,2,34,2,1,3,23,1,2,34,6,63,4634,34,53,5};
    int i = 0;
    int j = 0;
    int min;
    int tmp;
    for (i = 0; i < len; i++) {
        j = i + 1;
        min = i;
        while (j < len) {
            if (arr[min] > arr[j]) {
                min = j;
            }
            j++;
        }
        tmp = arr[min];
        arr[min] = arr[i];
        arr[i] = tmp;
    }
    i = 0;
    while(i < len) {
        printf("%d ", arr[i]);
        i++;
    }
}

```



### 快速排序

```c
#include<stdio.h>
#include<stdlib.h>

void QuickSort(List L) {
    QSort(L, 1, L->length);

    void QSort(List L, int low, int high) {
        int pivot;
        if (low < high) {
            pivot = Partition(L, low, high);
            QSort(L, low, pivot - 1);
            QSort(L, pivot + 1, hight);
        }
    }

    int Partition(List L, int low, int high) {
        int pivotkey;
        pivotkey = L[low];
        while(low < high) {
            while(low < high && L[high] >= pivotkey) {
                high--;
            }
            // swap(L, low, high); // 上面的 while 循环找到 high 索引的值比目标值要小，然后和 low 索引的值交换
            L[low] = L[high]
            while(low < high && L[low] <= pivotkey) {
                low++
            }
            // swap(L, low, high); // 上面的 while 循环找到 low 索引的值比目标值要大，然后和 high 索引的值交换
            L[high] = L[low]
        }
        R[low] = pivotkey;
        return low;
    }
}

```



### 归序排序

### 二叉树

#### 生成二叉树

```c
#include<stdio.h>
#include<stdlib.h>
 
typedef char ElementType;
typedef struct TNode *Position; /* 结构体指针 */
typedef Position BinTree; /* 二叉树类型 */
struct TNode{ /* 树结点定义 */
    ElementType data; /* 结点数据 */
    BinTree lchild;     /* 指向左子树 */
    BinTree rchild;    /* 指向右子树 */
}TNode;

void CreateBinaryTree ( BinTree *T ) {
    ElementType ch;
    scanf("%c",&ch);

    if (ch == '#')
        *T = NULL;
    else {
        *T = (BinTree)malloc(sizeof(TNode));
        (*T)->data = ch;
        CreateBinaryTree(&((*T)->lchild));
        CreateBinaryTree(&((*T)->rchild));
    }
}


int main ()
{
    BinTree myTree;
  printf("Create your Binary Tree:\n");
  CreateBinaryTree(&myTree);
  printf("\n PreOrder:");
}
```



#### 前序

```c
void FrontOrderTraverse(BinTree T) {
    if (T == NULL) 
      return;
    printf("%c", T->data);
    FrontOrderTraverse(T->lchild);
    FrontOrderTraverse(T->rchild);
}
```



#### 中序

```c
void InOrderTraverse(BinTree T) {
    if (T == NULL) 
      return;
    InOrderTraverse(T->lchild);
    printf("%c", T->data);
    InOrderTraverse(T->rchild);
}
```



#### 后序

```c
void PostOrderTraverse(BinTree T) {
    if (T == NULL) 
      return;
    PostOrderTraverse(T->lchild);
    PostOrderTraverse(T->rchild);
    printf("%c", T->data);
}

```



#### 层序

```c
void levelorder(BinTree bt) {
  LKQue: Q;
  InitQueue(Q);
  if (bt != NULL) {
    EnQueue(&Q, bt);
    while (!EmptyQueuq(Q)) {
      p = Gethead(&Q);
      outQueue(&Q);
      visit(p);
      if (p->lchild != NULL) EnQueue(&Q, p->lchild);
      if (p->rchild != NULL) EnQueue(&Q, p->rchild);
    }
  }
}
```

