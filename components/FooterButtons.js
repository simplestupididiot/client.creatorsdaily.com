import styled from 'styled-components'
import { BackTop, Button, Tooltip, notification } from 'antd'
import { useEffect, useState } from 'react'
import useToggle from 'react-use/lib/useToggle'
import BellFilled from '@ant-design/icons/BellFilled'
import ChromeFilled from '@ant-design/icons/ChromeFilled'
import RocketFilled from '@ant-design/icons/RocketFilled'

const ActiveBell = styled(BellFilled)`
color: #DE7B76;
`

const StyledIcon = styled.img`
  width: 49px;
  height: 49px;
  margin-left: -10px;
`

const ShakeBell = styled(ActiveBell)`
animation: bellshake .5s cubic-bezier(.36,.07,.19,.97) infinite alternate;
transform-origin: top center;
@keyframes bellshake {
  0% { transform: rotate(0); }
  15% { transform: rotate(8deg); }
  30% { transform: rotate(-8deg); }
  45% { transform: rotate(5deg); }
  60% { transform: rotate(-5deg); }
  75% { transform: rotate(2deg); }
  85% { transform: rotate(-2deg); }
  92% { transform: rotate(1deg); }
  100% { transform: rotate(0); }
}
`

const Container = styled.div`
height: 32px;
width: 200px;
display: flex;
justify-content: flex-end;
button {
  margin-left: 12px;
}
`

let installPrompt

export default () => {
  const [canInstall, setCanInstall] = useToggle(false)
  const [isPushSupported, setIsPushSupported] = useToggle(false)
  const [permission, setPermission] = useState('loading')

  useEffect(() => {
    const OneSignal = window.OneSignal
    OneSignal.push(async () => {
      const _isPushSupported = OneSignal.isPushNotificationsSupported()
      setIsPushSupported(_isPushSupported)
      if (!_isPushSupported) return
      const _permission = await OneSignal.getNotificationPermission()
      setPermission(_permission)
    })
  }, [])

  useEffect(() => {
    const OneSignal = window.OneSignal
    OneSignal.push(() => OneSignal.on('notificationPermissionChange', changed => setPermission(changed.to)))
    return () => OneSignal.push(() => OneSignal.off('notificationPermissionChange'))
  }, [])

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  useEffect(() => {
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => window.removeEventListener('appinstalled', handleAppInstalled)
  }, [])

  const handleBeforeInstallPrompt = e => {
    setCanInstall(true)
    installPrompt = e
  }

  const handleAppInstalled = () => {
    setCanInstall(false)
    notification.open({
      message: '应用安装成功',
      description: `安装成功，点击图标直接打开「${process.env.NAME}」`,
      icon: (<StyledIcon src='/apple-icon-180x180.png' />),
      duration: 3000,
      placement: 'bottomRight'
    })
  }

  const handleOpenPush = () => {
    const OneSignal = window.OneSignal
    OneSignal.push(() => {
      OneSignal.showNativePrompt()
    })
  }

  const handleInstall = () => {
    installPrompt.prompt()
  }

  const renderBellButton = () => {
    if (!isPushSupported) {
      return null
    }
    switch (permission) {
      case 'default':
        return (
          <Tooltip placement='top' title='开启通知，及时接收新动态'>
            <Button onClick={handleOpenPush}>
              <ShakeBell />
              开启通知
            </Button>
          </Tooltip>
        )
      case 'denied':
        return (
          <Tooltip placement='top' title='糟糕！通知被禁用了，请您重新打开'>
            <Button shape='circle' disabled>
              <BellFilled />
            </Button>
          </Tooltip>
        )
      case 'granted':
        return null
    }
  }
  const renderInstallButton = () => {
    if (!canInstall) {
      return null
    }
    return (
      <Tooltip placement='top' title='安装 Chrome 应用'>
        <Button onClick={handleInstall} shape='circle'>
          <ChromeFilled />
        </Button>
      </Tooltip>
    )
  }
  return (
    <Container>
      {renderInstallButton()}
      {renderBellButton()}
      <BackTop visibilityHeight={600}>
        <Tooltip placement='top' title='回到顶部'>
          <Button shape='circle' style={{ marginLeft: 0 }}>
            <RocketFilled />
          </Button>
        </Tooltip>
      </BackTop>
    </Container>
  )
}
