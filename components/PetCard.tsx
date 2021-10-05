import { Box, Heading, Text } from '@chakra-ui/react';

type Props = {
  id: string;
  name: string;
  species: string;
  birthdate: string;
};

const speciesIcons = {
  dog: '🐶',
  cat: '🐱',
}

const calculatePetAge = (birthdate: string) => {
  const petAgeInDays = (Date.now() - new Date(birthdate).valueOf()) / 1000 / 60 / 60 / 24;
  if (petAgeInDays < 7) {
    return `${petAgeInDays} days`;
  } else if (petAgeInDays >= 7 && petAgeInDays < 30) {
    const days = petAgeInDays % 7;
    const weeks = petAgeInDays / 7;
    return `${Math.floor(weeks)} weeks ${Math.floor(days)} days`;
  } else if (petAgeInDays >= 30 && petAgeInDays < 365) {
    const weeks = petAgeInDays % 4;
    const months = petAgeInDays / 30;
    return `${Math.floor(months)} months ${Math.floor(weeks)} weeks`;
  } else {
    const months = petAgeInDays % 30;
    const years = petAgeInDays / 365;
    return `${Math.floor(years)} years ${Math.floor(months)} months`;
  }
  

  
}

export default function PetCard({ id, name, species, birthdate }: Props) {
  const speciesIcon = speciesIcons[species];

  return (
    <Box shadow='xl' p="16px" minW="200px">
      <Heading size='md'>{speciesIcon} {name}</Heading>
      <Text>{birthdate ? calculatePetAge(birthdate) : 'When were they born?'}</Text>
    </Box>
  );
}
