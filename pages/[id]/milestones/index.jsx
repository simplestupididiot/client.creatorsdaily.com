import Head from 'next/head'
import styled from 'styled-components'
import validate from 'uuid-validate'
import { Col, Row, Spin } from 'antd'
import Container from '../../../components/Container'
import Milestones from '../../../components/Milestones'
import withApollo from '../../../libs/with-apollo'
import Product from '../../../layouts/Product'
import PorductSider from '../../../components/ProductSider'

const StyledContainer = styled(Container)`
margin-top: 24px;
margin-bottom: 24px;
`

const Content = ({ id, product, loading }) => {
  return (
    <StyledContainer>
      <Head>
        <title>里程碑 · {product.name} - {process.env.NAME}</title>
      </Head>
      <Row type='flex' gutter={24}>
        <Col xxl={18} xl={17} lg={16} md={14} sm={24} xs={24}>
          <Spin spinning={loading}>
            <Milestones productId={id} product={product} />
          </Spin>
        </Col>
        <Col xxl={6} xl={7} lg={8} md={10} sm={24} xs={24}>
          <PorductSider {...product} />
        </Col>
      </Row>
    </StyledContainer>
  )
}

const MilestonesPage = () => {
  return (
    <Product>
      <Content />
    </Product>
  )
}

MilestonesPage.getInitialProps = ({ query: { id }, res }) => {
  if (res && !validate(id)) {
    res.statusCode = 404
  }
  if (!validate(id)) return { statusCode: 404 }
  return {}
}

export default withApollo(MilestonesPage)
