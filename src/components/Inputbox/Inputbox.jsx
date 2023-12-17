import styled from "styled-components";
 
const Container = styled.div`
    background: rgba(0, 0, 0, 0.05);
    margin: 10px;
    padding: 5px;
`;
 
const Input = styled.input`
    border: none;
    background: white;
    border-radius: 2px;
    color: rgba(0, 0, 0, 0.8);
    height: 40px;
`;
const Button = styled.button`
    background: blue;
    color: white;
    border: none;
    border-radius: 5px;
    height: 40px;
    width: 140px;
`;
 
export default () => {
    return (
        <Container>
            <Input />
            <Button>다음</Button>
        </Container>
    );
}