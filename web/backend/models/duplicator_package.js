import PostgresSequelize from '../connector/postgres/index.js'
import { DataTypes } from 'sequelize'

const Model = PostgresSequelize.define('duplicator_package', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  shop: {
    type: DataTypes.STRING,
    allowNull: false,
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
  values.log = values.log ? JSON.parse(values.log) : null

  return values
}

Model.sync()

export default Model
