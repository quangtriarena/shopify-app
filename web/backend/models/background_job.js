import PostgresSequelize from '../connector/postgres/index.js'
import { DataTypes } from 'sequelize'

const Model = PostgresSequelize.define('background_jobs', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  shop: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELED'),
    defaultValue: 'PENDING',
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  message: {
    type: DataTypes.STRING,
  },
  data: {
    type: DataTypes.JSON,
    defaultValue: null,
  },
  result: {
    type: DataTypes.JSON,
    defaultValue: null,
  },
})

Model.prototype.toJSON = function () {
  let values = Object.assign({}, this.get())

  values.data = values.data ? JSON.parse(values.data) : null
  values.result = values.result ? JSON.parse(values.result) : null

  return values
}

Model.sync()

export default Model
