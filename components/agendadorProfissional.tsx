import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native'
import { useState } from 'react'
import { TextInputMask } from 'react-native-masked-text'

export default function AgendadorProfissional() {
    const [descricao, setDescricao] = useState('')
    const [endereco, setEndereco] = useState('')
    const [whatsapp, setWhatsapp] = useState('');
    const [instagram, setInstagram] = useState('')
    const [preco, setPreco] = useState('');


    return(
        <View style={styles.componentePai}>
            <Text style={styles.meuPerfil}>Meu Perfil</Text>
            <View style={styles.box}>
                <View style={styles.dadosProfissional}>
                    <Image style={styles.imagemProfissional}/>
                    <View style={styles.infoProfissional}>
                        <Text style={styles.nomeProfissional}></Text>
                        <Text style={styles.profissãoProfissional}></Text>
                        <Text style={styles.crp}></Text>
                    </View>
                </View>
                <Text style={styles.subtitulo}>Descrição</Text>
                <View style={styles.boxDescricao}>
                    <Text style={styles.inputDescricao}></Text>
                </View>
                <Text style={styles.subtitulo}>Endereço</Text>
                <View style={styles.boxEndereco}>
                    <Text style={styles.inputEndereco}></Text>
                </View>
                <View style={styles.whstsInsta}>
                    <View>
                        <Text style={styles.subtitulo}>Whatsapp</Text>
                        <View style={styles.boxWhats}>
                            <Text style={styles.inputWhats}></Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.subtitulo}>Instagram</Text>
                        <View style={styles.boxInsta}>
                            <Text style={styles.inputInsta}></Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.subtitulo}>Preço</Text>
                <View style={styles.boxPreco}>
                    <Text style={styles.inputPreco}></Text>
                </View>
                <Text style={styles.subtitulo}>Disponibilidade de Horários</Text>
                <TouchableOpacity>
                    <View>

                    </View>
                </TouchableOpacity>
            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    componentePai:{

    },
    meuPerfil:{

    },
    box:{

    },
    dadosProfissional:{
        flexDirection: 'row'

    },
    imagemProfissional:{
        width: 75,
        height: 75
    },
    infoProfissional:{

    },

    nomeProfissional:{

    },
    profissãoProfissional:{

    },
    crp:{

    },
    subtitulo:{

    },
  
    boxDescricao:{

    },
    inputDescricao:{

    },

    boxEndereco:{

    },
    inputEndereco:{

    },
    whstsInsta:{

    },

    boxWhats:{

    },
    inputWhats:{

    },

    boxInsta:{

    },
    inputInsta:{

    },
 
    boxPreco:{

    },
    inputPreco:{

    },
  
    botaoHorario:{

    },

    boxHorario:{

    }



})