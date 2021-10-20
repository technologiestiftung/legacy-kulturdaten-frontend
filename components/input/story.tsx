import styled from '@emotion/styled';
import { Story } from '@storybook/react';
import { useState } from 'react';
import { Input, InputType } from '.';
import { useT } from '../../lib/i18n';

export default {
  title: 'Input',
};

const StyledTestWrapper = styled.div<{ background?: string; color?: string }>`
  display: grid;
  padding: 1.5rem;
  row-gap: 1.5rem;
  grid-template-columns: 1fr 1fr;
  column-gap: 1.5rem;

  background: ${({ background }) => (background ? background : '')};
  color: ${({ color }) => (color ? color : '')};
`;

const StyledCell = styled.div`
  width: 100%;
`;

export const InputTextStory: Story = () => (
  <StyledTestWrapper>
    <StyledCell>
      <Input
        type={InputType.text}
        id="id-2"
        placeholder="Text placeholder"
        label="Input Label"
        required
        ariaLabel="Test aria label input"
      />
    </StyledCell>
  </StyledTestWrapper>
);

InputTextStory.storyName = 'Text Input';

export const InputNumberStory: Story = () => (
  <StyledTestWrapper>
    <StyledCell>
      <Input
        type={InputType.number}
        id="id-2"
        placeholder="10"
        label="Number between 10 and 100"
        step={10}
        min={10}
        max={100}
      />
    </StyledCell>
  </StyledTestWrapper>
);

InputNumberStory.storyName = 'Number Input';

export const InputTelStory: Story = () => (
  <StyledTestWrapper>
    <StyledCell>
      <Input type={InputType.tel} id="id-2" placeholder="+49 30 1111 2222" label="Telephone" />
    </StyledCell>
  </StyledTestWrapper>
);

InputTelStory.storyName = 'Telephone Input';

export const InputPasswordStory: Story = () => {
  const [pw1, setPw1] = useState<string>('');
  const [pw2, setPw2] = useState<string>('');

  const t = useT();

  const errorMessage = t('forms.errors.passwordConfirm') as string;

  return (
    <StyledTestWrapper>
      <StyledCell>
        <Input
          value={pw1}
          type={InputType.password}
          onChange={(e) => setPw1(e.target.value)}
          id="id-2"
          label="Passwort"
        />
      </StyledCell>
      <div />
      <StyledCell>
        <Input
          value={pw2}
          type={InputType.password}
          onChange={(e) => setPw2(e.target.value)}
          id="id-2"
          label="Passwort bestätigen"
          valid={pw1 === pw2}
          error={pw1 !== pw2 ? errorMessage : undefined}
        />
      </StyledCell>
    </StyledTestWrapper>
  );
};

InputPasswordStory.storyName = 'Password Input';

export const InputEmailStory: Story = () => (
  <StyledTestWrapper>
    <StyledCell>
      <Input type={InputType.email} id="id-2" label="Email" placeholder="name@email.com" />
    </StyledCell>
  </StyledTestWrapper>
);

InputEmailStory.storyName = 'Email Input';

export const InputUrlStory: Story = () => (
  <StyledTestWrapper>
    <StyledCell>
      <Input type={InputType.url} id="id-2" label="URL" placeholder="some-url.com" />
    </StyledCell>
  </StyledTestWrapper>
);

InputUrlStory.storyName = 'URL Input';

export const InputButtonStory: Story = () => (
  <StyledTestWrapper>
    <StyledCell>
      <Input type={InputType.submit} id="id-2" label="Submit" placeholder="some-url.com" />
    </StyledCell>
  </StyledTestWrapper>
);

InputButtonStory.storyName = 'Submit/Button Input';

export const InputLoginStory: Story = () => (
  <StyledTestWrapper>
    <StyledCell>
      <Input type={InputType.email} id="id-1" label="Email" placeholder="user@provider.com" />
    </StyledCell>
    <div />
    <StyledCell>
      <Input type={InputType.password} id="id-2" label="Password" />
    </StyledCell>
    <div />
    <StyledCell>
      <Input type={InputType.submit} id="id-3" value="Login" placeholder="some-url.com" />
    </StyledCell>
  </StyledTestWrapper>
);

InputLoginStory.storyName = 'Login example';
