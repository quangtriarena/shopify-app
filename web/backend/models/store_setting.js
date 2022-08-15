import PostgresSequelize from './../connector/postgres/index.js'
import { DataTypes } from 'sequelize'

const Model = PostgresSequelize.define('store_settings', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  shop: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'compositeIndex',
  },
  accessToken: {
    type: DataTypes.STRING,
  },
  scope: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('RUNNING', 'UNINSTALLED'),
    defaultValue: 'RUNNING',
  },
  contact: {
    type: DataTypes.STRING,
  },
  storePlan: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.ENUM('GUEST', 'MEMBERSHIP', 'ADMIN'),
    defaultValue: 'GUEST',
  },
  appPlan: {
    type: DataTypes.ENUM('BASIC', 'PRO', 'PLUS'),
    defaultValue: 'BASIC',
  },
  acceptedAt: {
    type: DataTypes.DATE,
  },
  testStore: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  credits: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  billings: {
    type: DataTypes.JSON,
    defaultValue: null,
  },
})

Model.prototype.toJSON = function () {
  let values = Object.assign({}, this.get())

  values.billings =
    values.billings && typeof values.billings === 'string' ? JSON.parse(values.billings) : null

  return values
}

Model.sync()

export default Model
