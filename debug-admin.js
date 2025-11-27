import fetch from 'node-fetch';

async function debugAdminFlow() {
    try {
        console.log('🔍 Testing admin authentication flow...');

        // Step 1: Login as admin
        console.log('Step 1: Logging in as admin...');
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });

        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);

        if (!loginData.success || !loginData.token) {
            console.log('❌ Login failed');
            return;
        }

        const token = loginData.token;
        console.log('✅ Login successful, token received');

        // Step 2: Check admin status
        console.log('Step 2: Checking admin status...');
        const adminCheckResponse = await fetch('http://localhost:3000/api/admin/check', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const adminCheckData = await adminCheckResponse.json();
        console.log('Admin check response:', adminCheckData);

        if (!adminCheckData.isAdmin) {
            console.log('❌ Admin check failed');
            return;
        }

        console.log('✅ Admin status confirmed');

        // Step 3: Test admin/users endpoint
        console.log('Step 3: Testing admin/users endpoint...');
        const usersResponse = await fetch('http://localhost:3000/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!usersResponse.ok) {
            console.log('❌ Users endpoint failed:', usersResponse.status, usersResponse.statusText);
            const errorText = await usersResponse.text();
            console.log('Error response:', errorText);
            return;
        }

        const usersData = await usersResponse.json();
        console.log('✅ Users endpoint successful');
        console.log('Users count:', usersData.length);
        console.log('First user:', usersData[0]);

        // Step 4: Test admin/stats endpoint
        console.log('Step 4: Testing admin/stats endpoint...');
        const statsResponse = await fetch('http://localhost:3000/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!statsResponse.ok) {
            console.log('❌ Stats endpoint failed:', statsResponse.status, statsResponse.statusText);
            return;
        }

        const statsData = await statsResponse.json();
        console.log('✅ Stats endpoint successful');
        console.log('Stats data:', statsData);

        console.log('🎉 All admin endpoints working correctly!');

    } catch (error) {
        console.error('❌ Debug error:', error.message);
    }
}

debugAdminFlow();