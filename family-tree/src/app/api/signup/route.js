export async function POST(request) {
    const body = await request.json();
    const { email, password } = body;
  
    console.log('New user signup:', { email, password });
  
    return Response.json({ message: 'User created successfully!' });
  }
  