import PropTypes from 'prop-types'
import { Modal, TextContainer } from '@shopify/polaris'

ConfirmCancel.propTypes = {
  onDiscard: PropTypes.func,
  onSubmit: PropTypes.func,
}

ConfirmCancel.defaultProps = {
  onDiscard: () => null,
  onSubmit: () => null,
}

function ConfirmCancel(props) {
  const { onDiscard, onSubmit } = props

  return (
    <Modal
      open={true}
      onClose={onDiscard}
      title="Are you sure want to cancel process?"
      secondaryActions={[
        {
          content: 'Discard',
          onAction: onDiscard,
        },
        {
          content: 'Cancel now',
          onAction: onSubmit,
          destructive: true,
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <p>This cannot be undone.</p>
        </TextContainer>
      </Modal.Section>
    </Modal>
  )
}

export default ConfirmCancel
