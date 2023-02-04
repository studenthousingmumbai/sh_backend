import axios from 'axios'; 

(async () => { 
    for(let i =29; i < 300; i++) { 
        axios("http://localhost:8000/user/signup", { 
            method: "POST", 
            data: { 
                firstname: "Tanay", 
                lastname: "Kulkarni", 
                email: `user_${i}@test.com`, 
                password: "Test@1234"
            }
        })
    }

    // await Promise.all(promises); 
    console.log("All users created!!");
})();