import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
 
class EmailController {
    static CreateEmail = async (req, res) => {
        let email = req.body.email;
        let cpanelHost = process.env.CPANEL_HOST
        let cpanelUser = process.env.CPANEL_USER
        let cpanelToken = process.env.CPANEL_TOKEN
        let password = process.env.EMAIL_PASSWORD
        let quota = process.env.EMAIL_QUOTA
        

        try {
            const response = await axios.post(`https://${cpanelHost}:2083/execute/Email/add_pop`, {
              domain: cpanelHost,
              email: email,
              password: password,
              quota: quota
            }, {
              headers: {
                Authorization: `cpanel ${cpanelUser}:${cpanelToken}`
              }
            });
        
            if (!200) {
              console.log('Email  não foi criado devido a erro');
            } else {
                res.status(200).send({message: `E-mail craido com sucesso, você já pode acessar!`});
            }
          } catch (error) {
            console.error('Erro ao criar email:', error.message);
          }
        }
    static ListEmails = async (req, res) => {
        let cpanelHost = process.env.CPANEL_HOST
        let cpanelUser = process.env.CPANEL_USER
        let cpanelToken = process.env.CPANEL_TOKEN
        try {
            const response = await axios.post(`https://${cpanelHost}:2083/execute/Email/list_pops`, {
              domain: cpanelHost,
              }, {
              headers: {
                Authorization: `cpanel ${cpanelUser}:${cpanelToken}`
              }
            });

            function filterEmailsWithCamera(data) {
                const emailsWithCamera = [];
              
                data.forEach(item => {
                  const { email } = item;
              
                  if (email.includes('camera')) {
                    emailsWithCamera.push({ email });
                  }
                });
              
                return emailsWithCamera;
              }
        
            console.log('Lista de emails de cameras:');
            const emailsWithCamera = filterEmailsWithCamera(response.data.data);
            res.status(200).send(emailsWithCamera);
          } catch (error) {
            console.error('Erro ao listar emails:', error.response.data);
          }
        }

    
    };
  
  
  export default EmailController;
  