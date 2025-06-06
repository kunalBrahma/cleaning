export const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123'
    }
  ];
  
  export function findUserByCredentials(email: string, password: string) {
    return mockUsers.find(user => user.email === email && user.password === password);
  }