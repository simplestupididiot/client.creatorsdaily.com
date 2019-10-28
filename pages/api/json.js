import get from 'lodash/get'
import initApollo from '../../libs/init-apollo'
import createFeed from '../../libs/feed'
import { GET_PRODUCTS } from '../../queries'

const apollo = initApollo()

export default async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  const data = await apollo.query({
    query: GET_PRODUCTS
  })
  const list = get(data, 'data.getProducts.data', [])
  const feed = createFeed(list)
  res.end(feed.json1())
}