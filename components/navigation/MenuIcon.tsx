import styled from '@emotion/styled';
import React from 'react';

export enum MenuIconName {
  start = 'start',
  organizer = 'organizer',
  offer = 'offer',
  location = 'location',
  user = 'user',
}

const StartSvg: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.25 9.75L12 4.5L18.75 9.75V18C18.75 18.3978 18.592 18.7794 18.3107 19.0607C18.0294 19.342 17.6478 19.5 17.25 19.5H6.75C6.35218 19.5 5.97064 19.342 5.68934 19.0607C5.40804 18.7794 5.25 18.3978 5.25 18V9.75Z"
      stroke="#111111"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.75 19.5V12H14.25V19.5"
      stroke="#111111"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LocationSvg: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9.5" fill="#46948C" stroke="url(#paint0_linear)" />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="4.5"
        y1="5"
        x2="19"
        y2="19.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#6FC1B9" />
        <stop offset="1" stopColor="#1B645C" />
      </linearGradient>
    </defs>
  </svg>
);

const OfferSvg: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="1.58978"
      y="5.98959"
      width="17"
      height="17"
      rx="2.5"
      transform="rotate(-15 1.58978 5.98959)"
      fill="#273B8A"
      stroke="url(#paint1_linear)"
    />
    <defs>
      <linearGradient
        id="paint1_linear"
        x1="2.20215"
        y1="6.34314"
        x2="18.2021"
        y2="22.3431"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#6984EF" />
        <stop offset="1" stopColor="#000B37" />
      </linearGradient>
    </defs>
  </svg>
);

const OrganizerSvg: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.1823 4.32248C16.6842 2.46356 14.3606 1.84094 12.9997 3.20177L3.20178 12.9997C1.84095 14.3606 2.46357 16.6842 4.3225 17.1823L17.7068 20.7686C19.5657 21.2667 21.2667 19.5657 20.7686 17.7067L17.1823 4.32248Z"
      fill="#E60032"
      stroke="url(#paint2_linear)"
    />
    <defs>
      <linearGradient
        id="paint2_linear"
        x1="8.19702"
        y1="8.6969"
        x2="19.697"
        y2="20.1969"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E58EA1" />
        <stop offset="1" stopColor="#9F0B2B" />
      </linearGradient>
    </defs>
  </svg>
);

const UserSvg: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 18.75V17.25C18 16.4544 17.6839 15.6913 17.1213 15.1287C16.5587 14.5661 15.7956 14.25 15 14.25H9C8.20435 14.25 7.44129 14.5661 6.87868 15.1287C6.31607 15.6913 6 16.4544 6 17.25V18.75"
      stroke="#111111"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 11.25C13.6569 11.25 15 9.90685 15 8.25C15 6.59315 13.6569 5.25 12 5.25C10.3431 5.25 9 6.59315 9 8.25C9 9.90685 10.3431 11.25 12 11.25Z"
      stroke="#111111"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StyledMenuicon = styled.div`
  svg {
    display: block;
  }
`;

interface MenuIconProps {
  type: MenuIconName;
}

const icons: { [key in MenuIconName]: React.FC } = {
  start: StartSvg,
  organizer: OrganizerSvg,
  location: LocationSvg,
  offer: OfferSvg,
  user: UserSvg,
};

export const MenuIcon: React.FC<MenuIconProps> = ({ type }: MenuIconProps) => (
  <StyledMenuicon>{React.createElement(icons[type])}</StyledMenuicon>
);
