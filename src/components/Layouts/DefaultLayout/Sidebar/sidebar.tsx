import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import todoListLogo from '../../../../assets/todoListLogo.png'
import { faListCheck } from '@fortawesome/free-solid-svg-icons'
import useGlobalContext from '../../../../context/globalVariables'

export default function Sidebar(){
    const { setPage } = useGlobalContext()!; 

    return (
        <div className="bg-blue-950 rounded-lg overflow-hidden   px-4 py-10">
            {/* logo */}
            <div className="  bg-bgMain flex justify-center items-center rounded-lg">   
                <img src={ todoListLogo } className='h-16 w-16'></img> 
            </div> 

            {/* pages */}
            <ul className='px-3 my-10'>
                <li 
                    className='my-3 py-2 bg-bgMain flex justify-center items-center rounded-lg'
                    onClick={() => setPage('TASK')}
                >  
                    <FontAwesomeIcon icon={faListCheck} className='text-2xl' /> 
                    <h2 className='font-bold text-xl ml-3'>TASK</h2>  
                </li> 
            </ul>
        </div>
    )
}