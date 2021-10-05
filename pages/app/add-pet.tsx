import { gql, useMutation } from '@apollo/client';
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Container,
  RadioGroup,
  Stack,
  Radio,
} from '@chakra-ui/react';

import { Formik, Form, Field } from 'formik';
import { useSession } from 'next-auth/client';

const ADD_PET = gql`
  mutation AddPetMutation(
    $addPetName: String!
    $addPetUserOwnerId: String!
    $addPetBirthdate: String
    $addPetSpecies: String
  ) {
    addPet(
      name: $addPetName
      userOwnerId: $addPetUserOwnerId
      birthdate: $addPetBirthdate
      species: $addPetSpecies
    ) {
      id
      name
      birthdate
      species
    }
  }
`;

const AddPet = () => {
  const [session, loading] = useSession();
  const [addPet, { data }] = useMutation(ADD_PET);

  const ownerId = session?.user?.email;

  console.log(session);
  const validateName = (value: string) => {
    let error;
    if (!value) {
      error = 'Name is required';
    }
    return error;
  };

  return (
    <Container>
      <Formik
        initialValues={{ species: '', name: '', birthdate: '' }}
        onSubmit={async (values, actions) => {
          console.log('add pet');
          console.log({ values });
          await addPet({
            variables: {
              addPetName: values.name,
              addPetSpecies: values.species,
              addPetBirthdate: values.birthdate,
              addPetUserOwnerId: ownerId,
            },
          });
        }}
      >
        {(props) => (
          <Form>
            <Field name='species'>
              {({ field, form, onChange }) => (
                <FormControl>
                  <FormLabel htmlFor='species'>Woof or meow?</FormLabel>
                  <RadioGroup
                    id='species'
                    onChange={(value) => {
                      props.setFieldValue('species', value);
                    }}
                  >
                    <Stack direction='row'>
                      <Radio value='dog'>Dog 🐕‍🦺</Radio>
                      <Radio value='cat'>Cat 🐈</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              )}
            </Field>
            <Field name='name' validate={validateName}>
              {({ field, form }) => (
                <FormControl
                  isRequired
                  isInvalid={form.errors.name && form.touched.name}
                >
                  <FormLabel htmlFor='name'>Pet name</FormLabel>
                  <Input {...field} type='text' id='name' placeholder='Fido' />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name='birthdate'>
              {({ field, form }) => (
                <FormControl>
                  <FormLabel htmlForm='birthdate'>Pet's birthdate 🎂</FormLabel>
                  <Input {...field} type='date' id='birthdate'></Input>
                </FormControl>
              )}
            </Field>
            <Button isLoading={props.isSubmitting} type='submit'>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AddPet;
