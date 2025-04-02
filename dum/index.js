async function waitList() {
   const response = await fetch('localhost:3001/users/collectemail', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         email: 'martins@gmail.com',
         type: 'waitlist',
      }),
   });
   console.log(await response.json());
}
async function Message() {
   const response = await fetch('localhost:3001/users/collectemail', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         email: 'martins@gmail.com',
         name: 'Martins',
         phonenumber: '08110841081',
         type: 'nothing',
         message: 'I want to anything!',
      }),
   });
   console.log(await response.json());
}

Message();
