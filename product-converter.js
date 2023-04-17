// {
//     "id": 2380912,
//     "name": "Tem trùm Winner V3 tổ ong huyền thoại Trắng Đỏ Đen decal 3 lớp cao cấp",
//     "code": "",
//     "img": "http://upload2.webbnc.vn/uploadv2/web/97/9724/product/2022/07/24/09/14/1658647970_img_1656758412157_1656758645150.jpg",
//     "subImg": [
//     "http://upload2.webbnc.vn/uploadv2/web/97/9724/product/2022/07/24/09/14/1658647970_img_1656758412157_1656758645150.jpg"
// ],
//     "seo": "tem-trum-winner-v3-to-ong-huyen-thoai-trang-do-den-decal-3-lop-cao-ca",
//     "shortDescription": "FREESHIP tem toàn quốc & thiết kế theo yêu cầu Có dịch vụ ship tem xe ra nước ngoài Đặt lịch & tư vấn decal tem xe liên hệ Zalo 0904560191. Khách hàng có thể tùy chỉnh thiết kế tem bằng cách thêm têm,\nsố hay logo... thậm chí đổi màu sắc và chất liệu theo ý thích của bạn. Vui lòng liên hệ để được tư vấn tốt nhất!\nBảo hành 12 tháng về tem khi dán trực tiếp tại cửa hàng.\n ",
//     "longDescription": "FREESHIP tem toàn quốc & thiết kế theo yêu cầu Có dịch vụ ship tem xe ra nước ngoài Đặt lịch & tư vấn decal tem xe liên hệ Zalo 0904560191. Khách hàng có thể tùy chỉnh thiết kế tem bằng cách thêm têm,\nsố hay logo... thậm chí đổi màu sắc và chất liệu theo ý thích của bạn. Vui lòng liên hệ để được tư vấn tốt nhất!\nBảo hành 12 tháng về tem khi dán trực tiếp tại cửa hàng.\n\nVì sao lựa chọn tem xe của Q-Decal? \n> Chất liệu cao cấp nhập khẩu 100% loại 3 lớp cực bền\n> Co giãn 4 chiều thoải mái và giấy rất dày dặn\n> Tùy chọn chất liệu thường, nhôm hoặc nhôm xước \n> Tem được cán 1 lớp bảo vệ nhám hoặc mờ tùy theo yêu cầu ",
//     "price": "380000",
//     "categoryName": "",
//     "categoryPath": ""
// },


const util = require('./util');
const baseUrl = 'http://qteam.com.vn';

module.exports = {
    convert: convert
}

function convert(rawProducts) {
    const convertedProducts = [];
    for (let i = 0; i < rawProducts.length; i++) {
        let rawProduct = rawProducts[i];
        let primaryImg = util.getImageFileNameFromUrl(rawProduct.img);
        const convertedProduct = {
            id: rawProduct.id,
            name: rawProduct.name,
            code: rawProduct.code,
            price: parsePrice(rawProduct.price),
            linkSeo: rawProduct.seo,
            description: rawProduct.longDescription,
            images: `/Upload/${primaryImg}`,
            imageMores: convertSubImgs(rawProduct.subImg),
            categoryId: rawProduct.categoryId,

        };
        convertedProducts.push(convertedProduct)
    }
    return convertedProducts;
}


function parsePrice(rawPrice) {
    return parseInt(rawPrice) || 0;
}

function convertSubImgs(subImgs) {
    if (subImgs == null || subImgs.length == 0) return null;
    let res = `<Images>`
    for (let i = 0; i < subImgs.length; i++) {
        let name = util.getImageFileNameFromUrl(subImgs[i]);
        res += `<Image>${baseUrl}/Upload/Images/${name}</Image>`
    }
    res += `</Images>`
    return res;
}
