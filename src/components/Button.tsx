import {Button as ButtonNativeBase, IButtonProps, Heading} from 'native-base';

type props = IButtonProps & {
  title: string;
}

export default function Button({title, ...rest}: props) {
  return (
    <ButtonNativeBase 
      bg={'green.700'}
      h={14}
      fontSize={'sm'}
      rounded={'sm'}
      _pressed={{ bg: 'gray.300', color: 'white' }}
      {...rest}
    >
      <Heading size='sm' color='white'>
        {title}
      </Heading>
    </ButtonNativeBase>
  );
}