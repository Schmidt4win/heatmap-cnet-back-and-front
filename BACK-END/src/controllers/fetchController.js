import fetTomodat from "../models/fetchModel.js"




class fetTomodatController {

    static CadastrarFetch = (req, res) => {
        let fetTomodats = new fetTomodat(req.body);
        fetTomodats.save((err) =>{
            if(err) {
                res.status(500).send({message: `${err.message} - falha ao cadastrar user.`})
            } else{
                res.status(201).send({message: "ok"})
            }
        })
    };



    static ListarFetch = (req, res) => {
      fetTomodat.find((err, fetTomodats)=>{
    res.status(200).json(fetTomodats)
})
};



}

export default fetTomodatController;
