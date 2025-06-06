import { Button, Spacer, TextField } from '@/modules/ui-components'
import { useState } from 'react'

export interface Props {
  onUnlokPress: (password: string) => void
  error?: string
}

const SignInView: React.FC<Props> = ({ onUnlokPress, error }) => {
  const [password, setPassword] = useState('')

  return (
    <>
      <TextField
        placeholder={`Master password`}
        label="Master password"
        autoCorrect={false}
        type="password"
        autoCapitalize="none"
        error={error}
        onChangeText={setPassword}
      />
      <Spacer space={8} />
      <Button style={{ width: '100%' }} onPress={() => onUnlokPress(password)} color="primary">
        Unlock
      </Button>
    </>
  )
}

export default SignInView
