import { useState } from "react";


   export function horariosClicados (horario: string) {
    const [horarioSelecionado, setHorarioSelecionado] = useState([''])
        if (horarioSelecionado.includes(horario)) {
            setHorarioSelecionado(horarioSelecionado.filter(h => h !== horario));
        } else {
            setHorarioSelecionado([...horarioSelecionado, horario]);
        }
    };