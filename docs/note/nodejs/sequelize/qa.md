---
title: Sequelize 开发时遇到的问题
date: 2022-05-16 10:35:00
tags: ["nodejs", "sequelize"]
categories: ["记录"]
---

# Sequelize 开发时遇到的问题



## M:N 关系实现



## M:N:M 关系中如何移除外键约束

### 解决方法

```typescript
@Table({
  tableName: 'task',
  underscored: true,
})
export class Task extends Model {
  @Column
  name: string;

  @BelongsToMany(() => Env, {
    through: {
      model: () => EnvProjectTask,
      unique: false
    },
  })
  envs: Env[]
}

```

github issue 给的处理方法：添加 `unique: false` 的配置，但在我这个 demo 行不通，表中还是添加主键约束。然后我在关联表中添加一个 id 字段，并设为主键，这时候就解决了：

```typescript
import { BelongsToMany, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'env__project__task',
  underscored: true,
})
export class EnvProjectTask extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number
  @Column({
    type: DataType.INTEGER,
    comment: 'env id',
    allowNull: false,
    unique: false,
  })
  @ForeignKey(() => Env)
  envId: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    comment: 'project id',
    allowNull: false,
    unique: false,
  })
  projectId: number;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
    comment: 'task id',
    allowNull: false,
    unique: false,
  })
  taskId: number;

}

@Table({
  tableName: 'env',
  underscored: true,
})
export class Env extends Model {
  @Column
  name: string;

  @BelongsToMany(() => Project, {
    through: {
      model: () => EnvProjectTask,
      unique: false
    },
  })
  projects: Project[]

  @BelongsToMany(() => Task, {
    through: {
      model: () => EnvProjectTask,
      unique: false
    },
  })
  task: Task[]
}

@Table({
  tableName: 'project',
  underscored: true,
})
export class Project extends Model {
  @Column
  name: string;

  @BelongsToMany(() => Env, {
    through: {
      model: () => EnvProjectTask,
      unique: false
    },
  })
  envs: Env[]
}

@Table({
  tableName: 'task',
  underscored: true,
})
export class Task extends Model {
  @Column
  name: string;

  @BelongsToMany(() => Env, {
    through: {
      model: () => EnvProjectTask,
      unique: false
    },
  })
  envs: Env[]
}

```

但是这样做的话 mysql 的约束会完全去掉，我想达到的效果是三个 id 组成一个唯一



### 参考资料

1. [gist](https://gist.github.com/mx781/dc6b86fad71c394872834397c3f8a52f)
2. [相关 issue](https://github.com/sequelize/sequelize/issues/5077)



## M:N 不支持 separate

未找到解决方法

### 参考资料

1. [issue](https://github.com/sequelize/sequelize/issues/4376)
