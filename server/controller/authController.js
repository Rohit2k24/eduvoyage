const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');

exports.userRegister = async (req, res) => {
    const { firstName,lastName, email, password, role,phone,address,country } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            firstname:firstName,
            lastname:lastName,
            email:email,
            password:password,
            role:role,
            phone:phone,
            address:address,
            country:country
            });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.status(201).json({status : 1, msg: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid email or password' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, 
            { expiresIn: '23h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({ status: 1, message: "Login Successful!", token, role: user.role });            }
        );
        // if (user.role=="Admin"){
        //     <Navigate to="/" replace={true} />;
        // }
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).send('Server error');
    }
};
