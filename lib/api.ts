import getConfig from 'next/config';

const {
  publicRuntimeConfig: { api },
} = getConfig();

export const validateUser = async (token: string): Promise<boolean> => {
  try {
    const resp = await fetch(new URL('auth/validate', api).toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { valid } = await resp.json();

    return valid;
  } catch (e) {
    throw e;
  }
};

export const getCurrentUserInfo = async (
  token: string
): Promise<{
  id: number;
  email: string;
  rememberMeToken: string;
  createdAt: Date;
  updatedAt: Date;
}> => {
  try {
    const resp = await fetch(new URL('auth/info', api).toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user: {
      id: number;
      email: string;
      rememberMeToken: string;
      createdAt: Date;
      updatedAt: Date;
    } = await resp.json();

    return user;
  } catch (e) {
    throw e;
  }
};

export const login = async (
  email: string,
  password: string
): Promise<{
  token: {
    type: 'bearer';
    token: string;
  };
  status: number;
  message: string;
}> => {
  try {
    const resp = await fetch(new URL('auth/login', api).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await resp.json();

    if (data.status === 200) {
      return data;
    }

    throw new Error('login error');
  } catch (e) {
    throw e;
  }
};

export const register = async (
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<{
  user: {
    email: string;
    createdAt: Date;
    updatedAt: Date;
    id: number;
  };
  status: number;
  message: string;
}> => {
  try {
    const resp = await fetch(new URL('auth/register', api).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    const data = await resp.json();

    if (data.status === 200) {
      return data;
    }

    throw new Error('register error');
  } catch (e) {
    throw e;
  }
};
