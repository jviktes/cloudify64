export default PropTypes.shape({
    country_code: PropTypes.string,
    region_code: PropTypes.string,
    region_name: PropTypes.string,
});


// "United Arab Emirates": {

//     "country_code": "AE",

//     "region_code": "ASIA",

//     "region_name": "ASIA"

// },


// export default PropTypes.arrayOf(
//     PropTypes.shape({
//         requestor: PropTypes.string,
//         deployment_id: PropTypes.string,
//         deployment_name: PropTypes.string,
//         results: PropTypes.arrayOf(
//             PropTypes.shape({
//                 actual_value: PropTypes.string,
//                 class: PropTypes.string,
//                 code: PropTypes.string,
//                 description: PropTypes.string,
//                 expected_value: PropTypes.string,
//                 name: PropTypes.string,
//                 result: PropTypes.string,
//                 // eslint-disable-next-line react/forbid-prop-types
//                 testResultArray: PropTypes.object
//             })
//         )
//     })
// );

