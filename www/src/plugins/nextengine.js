import axios from "axios";
import qs from "qs";

const isEmulating = window.location.hostname === "localhost";
let baseURL = 'https://api.next-engine.org'
  if (isEmulating) {
    baseURL =  '/ne_api'
  }

export default class Query{
  static get DEFAULT_LIMIT () {
    return 10000
  }
  static get DELIMITER_FIELD () {
    return ','
  }
  static get MAX_LOOP () {
    return 3
  }
  constructor(access_token, refresh_token, endpoint, conditions, opts) { 
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.endpoint = endpoint || null
    this.conditions = conditions || []
    this.opts = opts || { limit: Query.DEFAULT_LIMIT , offset: 0 }
    this.wait_flag = 1
  }
  async get (fields) {
    const where = this.toParameter(this.conditions)
    
    let params = Object.assign(where,
      {
        access_token:this.access_token,
        refresh_token:this.refresh_token,
        wait_flag:this.wait_flag,
      }
    )

    let loop = 1
    if(this.endpoint.indexOf('search')){
      let res_count = await this.checkCount(params)
      console.log(res_count)
      loop = Math.ceil(res_count.data.count / Query.DEFAULT_LIMIT) > Query.MAX_LOOP ? Query.MAX_LOOP : Math.ceil(res_count.data.count / Query.DEFAULT_LIMIT);
    }
    
    if (!!fields) {
      params = Object.assign(params, {fields: fields.join(Query.DELIMITER_FIELD)} )
    }

    let res 
    let all_axios = []
    let merge_data = []
    let data_count = 0

    console.log(loop)
    
    for (let i = 0; i < loop; i++) {
      console.log(i)
      params.offset = params.offset + (i + Query.DEFAULT_LIMIT)
      console.log(params.offset)
      all_axios.push(axios.post(baseURL + this.endpoint, qs.stringify(params)))
    }
    console.log(all_axios)
    res = await Promise.all(all_axios)
    .then((response) => {
      console.log(response);
      response.forEach((r,index)=>{
        //console.log(r.data.data)
        data_count += r.data.data.length
        merge_data = merge_data.concat(r.data.data)
      })
      response[0].data.count = data_count
      response[0].data.data = merge_data
      return response[0]
    })
    .catch((err) => {
      console.log(err);
      return err
    })
    console.log(res)
    return res
  }

  query (path) {
    this.endpoint = path
    return new Query(this.access_token, this.refresh_token, this.endpoint, this.conditions, this.opts)
  }
  
  where (field, operator, value) {
    const condition = [field, operator, value]
    const conditions = this.conditions.concat([condition])
    return new Query(this.access_token, this.refresh_token, this.endpoint, conditions, this.opts)
  }
  limit (limit) {
    this.opts = Object.assign({}, this.opts, { limit: limit })
    return new Query(this.access_token, this.refresh_token, this.endpoint, this.conditions, this.opts)
  }
  offset (offset) {
    this.opts = Object.assign({}, this.opts, { offset: offset })
    return new Query(this.access_token, this.refresh_token, this.endpoint, this.conditions, this.opts)
  }
  toParameter () {
    const where = this.conditions.reduce((acc, condition) => {
      const [field, operator, value] = condition
      acc[`${field}-${this.toOperator(operator)}`] = value
      return acc
    }, {})

    // offset: this.offset ? this.offset : 0,
    // limit: this.limit ? this.limit : Query.DEFAULT_LIMIT
    console.log(this.opts)
    return Object.assign(where, this.opts)
  }
  toOperator (operator) {
    switch (operator.toLowerCase()) {
      case '=':
        return 'eq'
      case '!=':
      case '<>':
        return 'neq'
      case '>':
        return 'gt'
      case '>=':
        return 'gte'
      case '<':
        return 'lt'
      case '<=':
        return 'lte'
      case 'in':
        return 'in'
      case 'not in':
        return 'nin'
      case 'like':
        return 'like'
      case 'not like':
        return 'nlike'
      case 'is null':
        return 'null'
      case 'is not null':
        return 'nnull'
      case 'is blank':
        return 'blank'
      case 'is not blank':
        return 'nblank'
      default:
        throw new Error('Unknown operator: ' + operator)
    }
  }
  async checkCount(params){
    //searchの場合は10000件以上あるか確認
    let count_endpoint = this.endpoint.replace('search', 'count')
    return await axios.post(baseURL + count_endpoint, qs.stringify(params))
  }
}

