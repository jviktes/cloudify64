export default PropTypes.arrayOf(
    PropTypes.shape({
        results: PropTypes.arrayOf(
            PropTypes.shape({
                actual_value: PropTypes.string,
                class: PropTypes.string,
                code: PropTypes.string,
                description: PropTypes.string,
                expected_value: PropTypes.string,
                name: PropTypes.string,
                result: PropTypes.string
            })
        )
    })
);