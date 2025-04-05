const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Nimadir serverdan xato ketdida !!", status: 500 });
};

export default errorHandler;
