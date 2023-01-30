# heatmap cnet back and front

 APP TÉCNICO PARA PROVEDOR.

Aplicativo Técnico para provedores de internet, aplicativo ainda em desenvolvimento, sendo feito com as técnologias: JS, ReactJs, NodeJS, ExpressJS, MongoDB.
O aplicativo usa a API do Google Maps para gerar o mapa e uma API no back para comunicar com a API de outro sistema de gerência de rede óptica (TOMODAT).

<div align="left">

<img src="./readme.images/login.jpg" width="800px" />

1. Tela de login feita com bootstrap, login com JWTauth no back.
(imagens acima)

</div>

<div align="left">

<img src="./readme.images/tela de entrada.jpg" width="800px" />

2. Tela de recepção do app, logo após autenticar o login, no topo vemos a barra superior com as funcionalidades, campo de pesquisa e botão de logout.
Na tela abre o mapa com o heatmap ativo, cada ponto do heatmap é uma CTO (Caixa de Atendimento Optico) em um raio de 200mt, facilitando a questão de vendas para provedores de internet, Ao iniciar a tela centraliza na cidade em que o provedor tem matriz (podendo ser alterado no cod as cidades que quer centralizar, possivel criar um botão para selecionar a cidade que quer centralizar) (imagens acima). 

</div>

<div align="left">

<img src="./readme.images/pesquisa clientes.jpg" width="800px" />

3. Tela da funcionalidade clientes, ao clicar nela abre uma barra lateral com dois campos de pesquisa, no primeiro campo como podemos ver, é o campo de pesquisa de cliente, ao digitar o nome no campo, ira retornar os clientes correspondentes, ao lado do nome tem dois botões, cto e cliente, uma para a localização da caixa de atendimento do cliente e outra para a localização do cliente caso já tenha cadastrada, se não tiver uma localização cadastrada, pode ser cadastrada uma nova, ou tambem atualizar a localização já existente (imagens acima). 
</div>


<div align="left">

<img src="./readme.images/cliente loc ja no sys.jpg" width="800px" />
<img src="./readme.images/cliente sem loc.jpg" width="800px" />

4. Tela da funcionalidade clientes, ao clicar no botão clientes abre um modal com botões para atualizar a localização do cliente, abrir no maps a localização do cleinte e um mini-mapa com a localização do cliente na tela, caso não tenha cadastrada a localização do cliente abre um modal com um botão para adicionar a localização do cliente (imagens acima).
</div>

<div align="left">

<img src="./readme.images/pesquisa cto.jpg" width="800px" />


5. Tela da pesquisa de CTO's, retorna a CTo correpondente com o texto pesquisado, indicando a cidade que se encontra a CTO, ao clicar no botão CTO centraliza o mapa no na CTO em questão (imagens acima).
</div>

<div align="left">

<img src="./readme.images/tela cto sem centralizar.jpg" width="800px" />


6. A direita no canto superior, há um campo de pesquisa de CTO's, se digitar apenas "R" no campo marca todas as CTO's no mapa (como na imagem), podendo pesquisar tambem todas as CTO's, mas sem centralizar na CTO (imagens acima).
</div>

<div align="left">

<img src="./readme.images/cto modal novo.jpg" width="800px" />
<img src="./readme.images/cto modal com marcacao.jpg" width="800px" />


7. Modal que aparece ao clicar em uma CTO no mapa, no modal vemos o nome da CTO em azul pois é um link para a localização da CTO no Google Maps, ao lado uma engrenagem que ativa a função "bater cto" que foi desenvolvida pensando nos técnicos de campo que usam o app para conferir os clientes na CTO, ao ativar essa função, ao lado do nome vemos uma caixa de marcação que quando selecionada risca o nome do cliente, permitindo assim uma forma mais rapida de bater a CTO de fato, aparece no modal tambem a quantidade de vagas na CTO, a quantoidade de clientes na CTO, ao lado do cliente "TESTE APP" vemos dois botões, são botões para copiar o nome do cliente de forma especifica, pois como usamos integradores que precisam de uma nomeclatura diferente servem para facilitar a vida dos técncnicos ao procurar o cliente, vemos tambem o botão de fechar a CTO e o de Add cliente, que serve para conectar o cliente a CTO (imagens acima).  
</div>

<div align="left">

<img src="./readme.images/modal add cliente.jpg" width="800px" />


8. Modal da função Add cliente que esta presente dentro do Modal da CTO, podemos ver 4 campos no modal, o primeiro é o unico que pode ser preenchido, que é o Nome do cliente, Caixa de atendimento, Lat e Lng são todos preenchidos automaticamente eplos sitema para evitar erro humano (imagens acima).
</div>

<div align="left">

<img src="./readme.images/funções heatmap.jpg" width="800px" />


9. Funções da parte do Heatmap, na imagem mostra as funções do Heatmap:
* on/off HeatMap - ativa e desativa o mapa de calor.
* Atualizar ctos - atualiza manualmente os dados do mapa recarregando o mapa.
* Mudar o gradiente - muda a cor do gradiente do mapa de calor.
* Mudar o raio - muda o raio do mapa de calor ( por padrão é fixo em 200mt).
* Mudar a opacidade - muda a opacidade do mapa, deixando a cor mais forte e não conseguindo ver o mapa por baixo do mapa de calor.
</div>

<div align="left">

<img src="./readme.images/ir até a mim.jpg" width="800px" />


10. Função que centraliza o mapa na posição do usuario, ao clicar no botão "ir até mim" gera um marcador no ponto onde o usuario está e centraliza o mapa no marcador (imagens acima).
</div>

<div align="left">

<img src="./readme.images/dashboard users.jpg" width="800px" />


11. Dashboard de controle de usuarios, nela podemos ver o nome do usuario, categoria e podemos editar o usuario, somente usuarios da categoria ADM tem acesso a esta dashboard (imagens acima).
</div>

<div align="left">

<img src="./readme.images/tela logs.jpg" width="800px" />


12. Tela de logs de clientes adicionados a CTO, usada para verificação e correção de erros, nesta tela sabemos a CTO, Cliente, Usuario, horario, data e lat/lng das adições no sistema,  fazendo assim ficar mais facil corrigir erros de usuario (imagens acima).
</div>

