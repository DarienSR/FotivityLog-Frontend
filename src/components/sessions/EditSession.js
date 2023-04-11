import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useGetSessionsByIdQuery } from './sessionsApiSlice'
import EditSessionForm from './EditSessionForm'

const EditSession = () => {
    const { id } = useParams()

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
      } = useGetSessionsByIdQuery(id, {
      
      })

    let session = data.entities[id]
    console.log("s", session)
    const content = data ? <EditSessionForm session={session} /> : <p>Loading...</p>

    return content
}
export default EditSession