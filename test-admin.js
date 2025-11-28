import fetch from 'node-fetch';

async function testAdminLogin() {
    try {
        console.log('Testing admin login...');

        // Test login
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });

        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);

        if (loginData.success && loginData.token) {
            console.log('✅ Admin login successful');

            // Test admin check
            const adminCheckResponse = await fetch('http://localhost:3000/api/admin/check', {
                headers: {
                    'Authorization': `Bearer ${loginData.token}`
                }
            });

            const adminCheckData = await adminCheckResponse.json();
            console.log('Admin check response:', adminCheckData);

            if (adminCheckData.isAdmin) {
                console.log('✅ Admin privileges confirmed');

                // Test admin users endpoint
                const usersResponse = await fetch('http://localhost:3000/api/admin/users', {
                    headers: {
                        'Authorization': `Bearer ${loginData.token}`
                    }
                });

                const usersData = await usersResponse.json();
                console.log('Users data:', usersData.length, 'users found');
                console.log('Admin users:', usersData.filter(u => u.is_admin === 1).map(u => u.username));
                console.log('✅ Admin system working correctly');
            } else {
                console.log('❌ Admin privileges not confirmed');
            }
        } else {
            console.log('❌ Admin login failed');
        }
    } catch (error) {
        console.error('Test error:', error.message);
    }
}

testAdminLogin();