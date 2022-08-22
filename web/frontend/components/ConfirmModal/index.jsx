import { Modal, TextContainer } from '@shopify/polaris'
import PropTypes from 'prop-types'

ConfirmModal.propTypes = {
  title: PropTypes.string,
  content: PropTypes.any,
  submitAction: PropTypes.object,
  discardAction: PropTypes.object,
}

ConfirmModal.defaultProps = {
  title: '',
  content: null,
  submitAction: {
    content: 'Submit',
    onAction: () => null,
    primary: true,
  },
  discardAction: {
    content: 'Submit',
    onAction: () => null,
  },
  onDiscard: () => null,
}

function ConfirmModal(props) {
  const { title, content, submitAction, discardAction } = props

  return (
    <Modal
      // activator={activator}
      open={true}
      onClose={discardAction.onAction}
      title={title}
      primaryAction={submitAction}
      secondaryActions={[discardAction]}
    >
      <Modal.Section>
        <TextContainer>{content}</TextContainer>
      </Modal.Section>
    </Modal>
  )
}

export default ConfirmModal
