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
      let content = "Loading";
    if(isSuccess) {
        let session = data.entities[id]
        content = <EditSessionForm session={session} />
    }
    return content
}
export default EditSession