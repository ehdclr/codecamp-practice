import { ApolloServer } from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";

const typeDefs = `#graphql
    input CreateBoardInput {
        writer: String
        title: String
        contents: String
    }

    type MyResult {
        number: Int
        writer: String
        title: String
        contents: String
    }

    type Query {
        # fetchBoards: MyResult # 객체 1개를 의미!
        fetchBoards: [MyResult] # 배열 안에 객체 1개 이상을 의미!
    }

    type Mutation {
        # createBoard(writer: String, title: String,contents: String) : String
        createBoard(createBoardInput: CreateBoardInput!): String
    }
`


const resolvers = {
    Query: {
        fetchBoards : (parent,args,context,info)=>{
            const result = [
                {
                  number: 1,
                  writer: '철수',
                  title: '제목입니다~~',
                  contents: '내용이에요@@@',
                },
                {
                  number: 2,
                  writer: '영희',
                  title: '영희 제목입니다~~',
                  contents: '영희 내용이에요@@@',
                },
                {
                  number: 3,
                  writer: '훈이',
                  title: '훈이 제목입니다~~',
                  contents: '훈이 내용이에요@@@',
                },
              ];

              return result;
        }
    },
    Mutation:{
        createBoard: (_,args) =>{
            console.log(args.createBoardInput.writer);
            console.log(args.createBoardInput.title);
            console.log(args.createBoardInput.contents);
            
            return "게시물 등록에 성공하였습니다."
        }
    }
    
};

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    cors: true,
})

startStandaloneServer(server);