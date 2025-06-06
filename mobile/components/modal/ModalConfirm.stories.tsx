import { View } from 'react-native'
import React, { useEffect } from 'react'
import { Props, ModalConfirmDelete } from './ModalConfirm'

export default {
  title: 'ModalConfirm',
  component: ModalConfirmDelete,
  decorators: [
    (Story: React.FC) => (
      <View style={{ width: '90%', height: '90%' }}>
        <Story />
      </View>
    )
  ],

  argTypes: {
    argTypes: {
      onClose: { action: 'onClose pressed', description: 'Callback when close button is pressed' },
      onConfirm: { action: 'onConfirm pressed', description: 'Callback when confirm button is pressed' },
      visible: { control: 'boolean', defaultValue: true, description: 'Show or hide the modal' }
    }
  },
  args: {
    visible: false,
    title: 'Account Override',
    message: 'This account name is already in use. Do you want to override it?',
    onClose: () => null,
    onConfirm: () => null
  }
}

export const Confirm = (props: Props) => {
  const [showModal, setShowModal] = React.useState(props.visible)

  useEffect(() => {
    setShowModal(props.visible)
  }, [props.visible])

  return <ModalConfirmDelete {...props} onCancel={() => setShowModal(false)} visible={showModal} />
}
